package com.consulting.appointment.dto;

import com.consulting.appointment.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private String id;
    private String clientId;
    private String consultantId;
    private String consultantName; // ✅ nouveau champ
    private Instant dateTime;
    private Integer durationMinutes;
    private AppointmentStatus status;
    private String mode;
    private String clientNote;
    private String consultantNote;
    private Instant createdAt;
}