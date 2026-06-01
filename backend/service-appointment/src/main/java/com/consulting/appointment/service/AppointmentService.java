package com.consulting.appointment.service;

import com.consulting.appointment.dto.AppointmentResponse;
import com.consulting.appointment.dto.CreateAppointmentRequest;
import com.consulting.appointment.model.Appointment;
import com.consulting.appointment.model.AppointmentStatus;
import com.consulting.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;

    // Un client reserve un creneau
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

        return toResponse(repository.save(appointment));
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

    // Le consultant confirme, annule, ou marque comme termine
    public AppointmentResponse updateStatus(String id, AppointmentStatus status) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
        appointment.setStatus(status);
        return toResponse(repository.save(appointment));
    }

    // Le consultant ajoute une note de preparation
    public AppointmentResponse setConsultantNote(String id, String note) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
        appointment.setConsultantNote(note);
        return toResponse(repository.save(appointment));
    }

    private AppointmentResponse toResponse(Appointment a) {
        return new AppointmentResponse(
                a.getId(), a.getClientId(), a.getConsultantId(),
                a.getDateTime(), a.getDurationMinutes(), a.getStatus(),
                a.getMode(), a.getClientNote(), a.getConsultantNote(),
                a.getCreatedAt()
        );
    }
}