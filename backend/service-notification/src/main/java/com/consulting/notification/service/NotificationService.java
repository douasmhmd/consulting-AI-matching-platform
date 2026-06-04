package com.consulting.notification.service;

import com.consulting.notification.model.*;
import com.consulting.notification.repository.DeviceTokenRepository;
import com.consulting.notification.repository.NotificationRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final DeviceTokenRepository deviceTokenRepository;
    private final NotificationRepository notificationRepository;

    // Enregistre le token FCM d'un appareil (evite les doublons)
    public DeviceToken registerToken(String userId, String fcmToken) {
        return deviceTokenRepository.findByFcmToken(fcmToken)
                .orElseGet(() -> deviceTokenRepository.save(
                        DeviceToken.builder()
                                .userId(userId)
                                .fcmToken(fcmToken)
                                .build()));
    }

    // Envoie une notification a un utilisateur (tous ses appareils) + l'enregistre
    public Notification sendToUser(String userId, String title, String body, NotificationType type) {
        // 1. Enregistrer la notification en base (historique)
        Notification notification = notificationRepository.save(
                Notification.builder()
                        .userId(userId)
                        .title(title)
                        .body(body)
                        .type(type)
                        .build());

        // 2. Envoyer via FCM a tous les appareils de l'utilisateur
        List<DeviceToken> tokens = deviceTokenRepository.findByUserId(userId);
        for (DeviceToken device : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(device.getFcmToken())
                        .putData("title", title)
                        .putData("body", body)
                        .putData("type", type.name())
                        .build();
                FirebaseMessaging.getInstance().send(message);
            } catch (Exception e) {
                System.err.println("Echec envoi FCM vers " + device.getFcmToken() + " : " + e.getMessage());
            }
        }

        return notification;
    }

    // Historique des notifications d'un utilisateur
    public List<Notification> getMyNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}