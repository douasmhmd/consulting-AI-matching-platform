package com.consulting.appointment.controller;

import com.consulting.appointment.dto.AppointmentResponse;
import com.consulting.appointment.dto.ConsultantNoteRequest;
import com.consulting.appointment.dto.CreateAppointmentRequest;
import com.consulting.appointment.dto.UpdateStatusRequest;
import com.consulting.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @GetMapping("/health")
    public String health() {
        return "Service Rendez-vous operationnel";
    }

    // Le client reserve un creneau
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<AppointmentResponse> create(
            @AuthenticationPrincipal String clientId,
            @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.ok(service.create(clientId, request));
    }

    // Le client liste ses propres RDV
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal String clientId) {
        return ResponseEntity.ok(service.findByClient(clientId));
    }

    // Detail d'un RDV (client ou consultant qui y est associe)
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Le consultant consulte les RDV associes a un consultantId
    @GetMapping("/consultant/{consultantId}")
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getByConsultant(
            @PathVariable String consultantId) {
        return ResponseEntity.ok(service.findByConsultant(consultantId));
    }

    // Mise a jour du statut (confirme, annule, complete)
    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }

    // Le consultant ajoute une note de preparation
    @PutMapping("/{id}/consultant-note")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<AppointmentResponse> setConsultantNote(
            @PathVariable String id,
            @RequestBody ConsultantNoteRequest request) {
        return ResponseEntity.ok(service.setConsultantNote(id, request.getConsultantNote()));
    }
}