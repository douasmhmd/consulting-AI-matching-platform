package com.consulting.consultant.service;

import com.consulting.consultant.dto.ConsultantResponse;
import com.consulting.consultant.dto.CreateConsultantRequest;
import com.consulting.consultant.dto.UpdateConsultantRequest;
import com.consulting.consultant.model.Consultant;
import com.consulting.consultant.model.ConsultantStatus;
import com.consulting.consultant.model.Discipline;
import com.consulting.consultant.repository.ConsultantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultantService {

    private final ConsultantRepository repository;

    public ConsultantResponse create(String userId, CreateConsultantRequest request) {
        if (repository.existsByUserId(userId)) {
            throw new RuntimeException("Un profil consultant existe deja pour cet utilisateur");
        }

        Consultant consultant = Consultant.builder()
                .userId(userId)
                .discipline(request.getDiscipline())
                .specialties(request.getSpecialties())
                .bio(request.getBio())
                .pricePerSession(request.getPricePerSession())
                .languages(request.getLanguages())
                .status(ConsultantStatus.PENDING)
                .build();

        return toResponse(repository.save(consultant));
    }

    public ConsultantResponse update(String userId, UpdateConsultantRequest request) {
        Consultant consultant = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil consultant introuvable"));

        if (request.getDiscipline() != null) consultant.setDiscipline(request.getDiscipline());
        if (request.getSpecialties() != null) consultant.setSpecialties(request.getSpecialties());
        if (request.getBio() != null) consultant.setBio(request.getBio());
        if (request.getPricePerSession() != null) consultant.setPricePerSession(request.getPricePerSession());
        if (request.getLanguages() != null) consultant.setLanguages(request.getLanguages());

        return toResponse(repository.save(consultant));
    }

    public ConsultantResponse getMyProfile(String userId) {
        return repository.findByUserId(userId)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Profil consultant introuvable"));
    }

    public ConsultantResponse getById(String id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Consultant introuvable"));
    }

    // Liste les consultants approuves d'une discipline (pour le matching et les clients)
    public List<ConsultantResponse> listApprovedByDiscipline(Discipline discipline) {
        return repository.findByDisciplineAndStatus(discipline, ConsultantStatus.APPROVED)
                .stream().map(this::toResponse).toList();
    }

    public List<ConsultantResponse> listPending() {
        return repository.findByStatus(ConsultantStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    public ConsultantResponse updateStatus(String id, ConsultantStatus status) {
        Consultant consultant = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultant introuvable"));
        consultant.setStatus(status);
        return toResponse(repository.save(consultant));
    }

    private ConsultantResponse toResponse(Consultant c) {
        return new ConsultantResponse(
                c.getId(), c.getUserId(), c.getDiscipline(), c.getSpecialties(),
                c.getBio(), c.getPricePerSession(), c.getLanguages(),
                c.getRating(), c.getStatus(), c.getCreatedAt()
        );
    }
}