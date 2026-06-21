package com.consulting.consultant.dto;

import com.consulting.consultant.model.ConsultantStatus;
import com.consulting.consultant.model.Discipline;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantResponse {
    private String id;
    private String userId;
    private Discipline discipline;
    private List<String> specialties;
    private String bio;
    private Double pricePerSession;
    private List<String> languages;
    private Double rating;
    private ConsultantStatus status;
    private Instant createdAt;
}