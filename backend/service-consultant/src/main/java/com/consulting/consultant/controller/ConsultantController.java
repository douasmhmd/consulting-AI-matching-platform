package com.consulting.consultant.controller;

import com.consulting.consultant.dto.ConsultantResponse;
import com.consulting.consultant.dto.CreateConsultantRequest;
import com.consulting.consultant.dto.StatusUpdateRequest;
import com.consulting.consultant.dto.UpdateConsultantRequest;
import com.consulting.consultant.model.Discipline;
import com.consulting.consultant.service.ConsultantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultants")
@RequiredArgsConstructor
public class ConsultantController {

    private final ConsultantService service;

    @GetMapping("/health")
    public String health() {
        return "Service Consultant operationnel";
    }

    // Le consultant connecte cree son profil
    @PostMapping
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<ConsultantResponse> create(
            @AuthenticationPrincipal String userId,
            @RequestBody CreateConsultantRequest request) {
        return ResponseEntity.ok(service.create(userId, request));
    }

    // Le consultant connecte consulte son propre profil
    @GetMapping("/me")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<ConsultantResponse> getMyProfile(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(service.getMyProfile(userId));
    }

    // Le consultant connecte met a jour son profil
    @PutMapping("/me")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<ConsultantResponse> updateMyProfile(
            @AuthenticationPrincipal String userId,
            @RequestBody UpdateConsultantRequest request) {
        return ResponseEntity.ok(service.update(userId, request));
    }

    // Tout utilisateur authentifie peut voir un consultant precis (pour le matching cote client)
    @GetMapping("/{id}")
    public ResponseEntity<ConsultantResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // Liste des consultants approuves par discipline (pour les clients)
    @GetMapping
    public ResponseEntity<List<ConsultantResponse>> listByDiscipline(
            @RequestParam Discipline discipline) {
        return ResponseEntity.ok(service.listApprovedByDiscipline(discipline));
    }

    // Endpoints admin
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConsultantResponse>> listPending() {
        return ResponseEntity.ok(service.listPending());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConsultantResponse> updateStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }
}