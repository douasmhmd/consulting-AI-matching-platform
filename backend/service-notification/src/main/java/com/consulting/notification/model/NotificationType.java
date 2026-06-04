package com.consulting.notification.model;

public enum NotificationType {
    APPOINTMENT_CREATED,    // nouveau RDV pour le consultant
    APPOINTMENT_CONFIRMED,  // RDV confirme pour le client
    APPOINTMENT_CANCELLED,  // RDV annule
    REMINDER,               // rappel avant seance
    GENERAL                 // notification generale
}