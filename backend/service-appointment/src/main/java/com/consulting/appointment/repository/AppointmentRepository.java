package com.consulting.appointment.repository;

import com.consulting.appointment.model.Appointment;
import com.consulting.appointment.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    List<Appointment> findByClientId(String clientId);

    List<Appointment> findByConsultantId(String consultantId);

    List<Appointment> findByConsultantIdAndStatus(String consultantId, AppointmentStatus status);

    // Verifier les conflits de creneau pour un consultant donne
    List<Appointment> findByConsultantIdAndDateTimeBetween(
            String consultantId, Instant start, Instant end);
}