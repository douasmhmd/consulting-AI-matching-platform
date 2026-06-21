package com.consulting.notification.model;

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
@Document(collection = "device_tokens")
public class DeviceToken {

    @Id
    private String id;

    @Indexed
    private String userId;       // proprietaire de l'appareil

    private String fcmToken;     // token FCM de l'appareil

    @Builder.Default
    private Instant registeredAt = Instant.now();
}