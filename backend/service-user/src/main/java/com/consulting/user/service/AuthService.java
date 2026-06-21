package com.consulting.user.service;

import com.consulting.user.dto.AuthResponse;
import com.consulting.user.dto.LoginRequest;
import com.consulting.user.dto.RegisterRequest;
import com.consulting.user.model.Role;
import com.consulting.user.model.User;
import com.consulting.user.repository.UserRepository;
import com.consulting.user.security.JwtService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    // Inscription : verifie le token Firebase et cree l'utilisateur en base
    public AuthResponse register(RegisterRequest request) {
        FirebaseToken decodedToken = verifyFirebaseToken(request.getFirebaseToken());

        String email = decodedToken.getEmail();
        String firebaseUid = decodedToken.getUid();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Un compte existe deja avec cet email");
        }

        Role role = parseRole(request.getRole());

        User user = User.builder()
                .firebaseUid(firebaseUid)
                .email(email)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .language(request.getLanguage())
                .city(request.getCity())
                .active(true)
                .build();

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, saved.getId(), saved.getEmail(), saved.getRole().name());
    }

    // Connexion : verifie le token Firebase et retrouve l'utilisateur
    public AuthResponse login(LoginRequest request) {
        FirebaseToken decodedToken = verifyFirebaseToken(request.getFirebaseToken());

        User user = userRepository.findByFirebaseUid(decodedToken.getUid())
                .orElseThrow(() -> new RuntimeException("Aucun compte trouve, veuillez vous inscrire"));

        if (!user.isActive()) {
            throw new RuntimeException("Ce compte est desactive");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }

    // Verifie un token Firebase via le SDK Admin
    private FirebaseToken verifyFirebaseToken(String firebaseToken) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Token Firebase invalide : " + e.getMessage());
        }
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            return Role.CLIENT;  // role par defaut si non precise
        }
    }
}