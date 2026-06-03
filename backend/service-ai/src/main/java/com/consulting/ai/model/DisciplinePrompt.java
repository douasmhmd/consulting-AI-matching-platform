package com.consulting.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "disciplines")
public class DisciplinePrompt {

    @Id
    private String id;

    @Indexed(unique = true)
    private Discipline discipline;

    private String displayName;     // ex: "Psychologie"
    private String systemPrompt;    // instructions pour l'IA lors de l'entretien
    private String description;      // courte description affichee au client
}