package com.consulting.appointment.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class CreateAppointmentRequest {
    private String consultantId;       // id du consultant choisi
    private Instant dateTime;          // date et heure souhaitees
    private Integer durationMinutes;   // optionnel, defaut 60
    private String mode;               // ONLINE ou IN_PERSON
    private String clientNote;         // message du client
}