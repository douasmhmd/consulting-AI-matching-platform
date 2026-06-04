package com.consulting.notification.dto;

import com.consulting.notification.model.NotificationType;
import lombok.Data;

@Data
public class SendNotificationRequest {
    private String userId;       // destinataire
    private String title;
    private String body;
    private NotificationType type;
}