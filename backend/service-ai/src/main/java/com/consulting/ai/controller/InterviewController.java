package com.consulting.ai.controller;

import com.consulting.ai.dto.MatchingResponse;
import com.consulting.ai.dto.InterviewResponse;
import com.consulting.ai.dto.SendMessageRequest;
import com.consulting.ai.model.Interview;
import com.consulting.ai.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor

public class InterviewController {
    // Matching : propose des consultants apres le rapport
    @GetMapping("/interviews/{id}/matching")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<MatchingResponse> getMatching(
            @AuthenticationPrincipal String clientId,
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String jwt = authHeader.substring(7); // enlever "Bearer "
        return ResponseEntity.ok(interviewService.getMatching(id, clientId, jwt));
    }

    private final InterviewService interviewService;

    @GetMapping("/health")
    public String health() {
        return "Service IA operationnel";
    }

    // Demarrer un nouvel entretien
    @PostMapping("/interviews")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<InterviewResponse> start(
            @AuthenticationPrincipal String clientId) {
        return ResponseEntity.ok(toResponse(interviewService.startInterview(clientId)));
    }

    // Envoyer un message dans l'entretien
    @PostMapping("/interviews/{id}/messages")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<InterviewResponse> sendMessage(
            @AuthenticationPrincipal String clientId,
            @PathVariable String id,
            @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(toResponse(
                interviewService.sendMessage(id, clientId, request.getMessage())));
    }

    // Generer le rapport final + discipline recommandee
    @PostMapping("/interviews/{id}/report")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<InterviewResponse> generateReport(
            @AuthenticationPrincipal String clientId,
            @PathVariable String id) {
        return ResponseEntity.ok(toResponse(
                interviewService.generateReport(id, clientId)));
    }

    // Consulter un entretien precis
    @GetMapping("/interviews/{id}")
    public ResponseEntity<InterviewResponse> getOne(
            @AuthenticationPrincipal String clientId,
            @PathVariable String id) {
        return ResponseEntity.ok(toResponse(interviewService.getInterview(id, clientId)));
    }

    // Lister mes entretiens
    @GetMapping("/interviews/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<InterviewResponse>> getMine(
            @AuthenticationPrincipal String clientId) {
        return ResponseEntity.ok(
                interviewService.getMyInterviews(clientId).stream().map(this::toResponse).toList());
    }

    private InterviewResponse toResponse(Interview i) {
        return new InterviewResponse(
                i.getId(), i.getClientId(), i.getMessages(), i.getStatus(),
                i.getReport(), i.getRecommendedDiscipline(),
                i.getCreatedAt(), i.getCompletedAt()
        );
    }
}