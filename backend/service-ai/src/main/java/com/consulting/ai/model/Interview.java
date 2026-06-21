package com.consulting.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    @Indexed
    private String clientId;        // userId du client

    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @Builder.Default
    private InterviewStatus status = InterviewStatus.IN_PROGRESS;

    // Resultats apres generation du rapport
    private String report;                  // rapport structure
    private Discipline recommendedDiscipline; // discipline conseillee

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant completedAt;
}