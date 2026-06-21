package com.consulting.notification.dto;

import lombok.Data;

@Data
public class RegisterTokenRequest {
    private String fcmToken;
}