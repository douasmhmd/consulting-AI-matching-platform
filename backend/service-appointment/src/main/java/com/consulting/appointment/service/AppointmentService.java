package com.consulting.appointment.service;

import com.consulting.appointment.dto.AppointmentResponse;
import com.consulting.appointment.dto.CreateAppointmentRequest;
import com.consulting.appointment.model.Appointment;
import com.consulting.appointment.model.AppointmentStatus;
import com.consulting.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;
    private final RestTemplate restTemplate;

    public AppointmentResponse create(String clientId, CreateAppointmentRequest request) {
        Appointment appointment = Appointment.builder()
                .clientId(clientId)
                .consultantId(request.getConsultantId())
                .dateTime(request.getDateTime())
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60)
                .mode(request.getMode())
                .clientNote(request.getClientNote())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = repository.save(appointment);

        // Notify consultant
        try {
            String consultantUserId = fetchConsultantUserId(request.getConsultantId());
            if (consultantUserId != null) {
                sendNotification(consultantUserId,
                        "Nouveau rendez-vous 📅",
                        "Un client a réservé une séance avec vous.",
                        "APPOINTMENT_BOOKED");
            }
        } catch (Exception e) {
            System.err.println("Erreur notification: " + e.getMessage());
        }

        return toResponse(saved);
    }

    public List<AppointmentResponse> findAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> findByClient(String clientId) {
        return repository.findByClientId(clientId).stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> findByConsultant(String consultantId) {
        return repository.findByConsultantId(consultantId).stream().map(this::toResponse).toList();
    }

    public AppointmentResponse findById(String id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
    }

    public AppointmentResponse updateStatus(String id, AppointmentStatus status) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
        appointment.setStatus(status);
        Appointment saved = repository.save(appointment);

        // Notify client when status changes
        try {
            String message = status == AppointmentStatus.CONFIRMED
                    ? "Votre rendez-vous a été confirmé ✅"
                    : status == AppointmentStatus.CANCELLED
                    ? "Votre rendez-vous a été annulé ❌"
                    : "Statut de votre rendez-vous mis à jour";

            sendNotification(saved.getClientId(),
                    "Mise à jour rendez-vous",
                    message,
                    "APPOINTMENT_STATUS_UPDATED");
        } catch (Exception e) {
            System.err.println("Erreur notification: " + e.getMessage());
        }

        return toResponse(saved);
    }

    public AppointmentResponse setConsultantNote(String id, String note) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
        appointment.setConsultantNote(note);
        return toResponse(repository.save(appointment));
    }

    private String fetchConsultantUserId(String consultantId) {
        try {
            Map result = restTemplate.getForObject(
                    "http://localhost:8082/api/consultants/" + consultantId,
                    Map.class);
            return result != null ? (String) result.get("userId") : null;
        } catch (Exception e) {
            return null;
        }
    }

    private void sendNotification(String userId, String title, String body, String type) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("title", title);
            payload.put("body", body);
            payload.put("type", type);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);
            restTemplate.postForObject(
                    "http://localhost:8085/api/notifications/send",
                    entity, Object.class);
        } catch (Exception e) {
            System.err.println("Erreur envoi notification: " + e.getMessage());
        }
    }

    private String fetchConsultantName(String consultantId) {
        try {
            Map response = restTemplate.getForObject(
                    "http://localhost:8082/api/consultants/" + consultantId,
                    Map.class);
            if (response != null) {
                return (String) response.get("discipline");
            }
        } catch (Exception e) {}
        return "Consultant";
    }

    private AppointmentResponse toResponse(Appointment a) {
        String consultantName = fetchConsultantName(a.getConsultantId());
        return new AppointmentResponse(
                a.getId(), a.getClientId(), a.getConsultantId(),
                consultantName,
                a.getDateTime(), a.getDurationMinutes(), a.getStatus(),
                a.getMode(), a.getClientNote(), a.getConsultantNote(),
                a.getCreatedAt()
        );
    }
}