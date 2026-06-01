package com.consulting.appointment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    @Indexed
    private String clientId;       // userId du client

    @Indexed
    private String consultantId;   // id du document Consultant (pas userId)

    private Instant dateTime;      // date et heure du creneau

    @Builder.Default
    private Integer durationMinutes = 60;

    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.PENDING;

    private String mode;           // ONLINE ou IN_PERSON

    private String clientNote;     // message du client lors de la reservation
    private String consultantNote; // demandes du consultant avant la seance

    @Builder.Default
    private Instant createdAt = Instant.now();
}