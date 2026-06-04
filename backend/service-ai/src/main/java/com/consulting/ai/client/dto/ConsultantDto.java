package com.consulting.ai.client.dto;

import lombok.Data;

import java.util.List;

@Data
public class ConsultantDto {
    private String id;
    private String userId;
    private String discipline;
    private List<String> specialties;
    private String bio;
    private Double pricePerSession;
    private List<String> languages;
    private Double rating;
    private String status;
}