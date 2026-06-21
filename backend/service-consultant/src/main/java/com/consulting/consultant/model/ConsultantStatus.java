package com.consulting.consultant.model;

public enum ConsultantStatus {
    PENDING,    // en attente de validation par l'admin
    APPROVED,   // valide, visible dans l'annuaire
    REJECTED    // rejete par l'admin
}