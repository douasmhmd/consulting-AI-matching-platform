package com.consulting.user.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firebaseToken;  // token recu de Firebase apres inscription cote mobile
    private String fullName;
    private String phone;
    private String role;
    private String language;
    private String city;
}