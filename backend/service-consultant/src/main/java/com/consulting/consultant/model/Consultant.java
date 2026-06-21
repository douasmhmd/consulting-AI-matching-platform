package com.consulting.consultant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "consultants")
public class Consultant {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;          // reference vers l'utilisateur (Service Utilisateur)

    private Discipline discipline;
    private List<String> specialties;
    private String bio;

    private Double pricePerSession;
    private List<String> languages;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private ConsultantStatus status = ConsultantStatus.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();
}