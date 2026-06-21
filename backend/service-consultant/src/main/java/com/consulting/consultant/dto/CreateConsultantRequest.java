package com.consulting.consultant.dto;

import com.consulting.consultant.model.Discipline;
import lombok.Data;

import java.util.List;

@Data
public class CreateConsultantRequest {
    private Discipline discipline;
    private List<String> specialties;
    private String bio;
    private Double pricePerSession;
    private List<String> languages;
}