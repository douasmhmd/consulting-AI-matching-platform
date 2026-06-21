package com.consulting.user.controller;

import com.consulting.user.model.User;
import com.consulting.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/health")
    public String health() {
        return "Service Utilisateur operationnel";
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(
            @AuthenticationPrincipal String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole().name(),
                "city", user.getCity() != null ? user.getCity() : "",
                "language", user.getLanguage() != null ? user.getLanguage() : "",
                "createdAt", user.getCreatedAt().toString()
        ));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(user -> Map.<String, Object>of(
                "id", user.getId(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole().name(),
                "city", user.getCity() != null ? user.getCity() : "",
                "language", user.getLanguage() != null ? user.getLanguage() : "",
                "createdAt", user.getCreatedAt().toString()
        )).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
}