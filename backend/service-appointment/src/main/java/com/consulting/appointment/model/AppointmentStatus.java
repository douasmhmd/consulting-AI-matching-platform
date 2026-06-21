package com.consulting.appointment.model;

public enum AppointmentStatus {
    PENDING,      // demande, en attente de confirmation par le consultant
    CONFIRMED,    // confirme par le consultant
    COMPLETED,    // sceance terminee
    CANCELLED     // annulee par le client ou le consultant
}