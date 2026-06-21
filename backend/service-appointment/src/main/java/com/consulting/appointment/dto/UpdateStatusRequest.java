package com.consulting.appointment.dto;

import com.consulting.appointment.model.AppointmentStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private AppointmentStatus status;
}