package com.consulting.notification.controller;

import com.consulting.notification.dto.RegisterTokenRequest;
import com.consulting.notification.dto.SendNotificationRequest;
import com.consulting.notification.model.DeviceToken;
import com.consulting.notification.model.Notification;
import com.consulting.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/health")
    public String health() {
        return "Service Notification operationnel";
    }

    // L'appareil enregistre son token FCM
    @PostMapping("/register-token")
    public ResponseEntity<DeviceToken> registerToken(
            @AuthenticationPrincipal String userId,
            @RequestBody RegisterTokenRequest request) {
        return ResponseEntity.ok(
                notificationService.registerToken(userId, request.getFcmToken()));
    }

    // Envoyer une notification a un utilisateur (appele par les autres services)
    @PostMapping("/send")
    public ResponseEntity<Notification> send(@RequestBody SendNotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendToUser(
                request.getUserId(), request.getTitle(),
                request.getBody(), request.getType()));
    }

    // L'utilisateur consulte ses notifications
    @GetMapping("/me")
    public ResponseEntity<List<Notification>> getMine(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }
}