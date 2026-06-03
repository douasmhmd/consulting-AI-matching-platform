package com.consulting.ai.repository;

import com.consulting.ai.model.Discipline;
import com.consulting.ai.model.DisciplinePrompt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DisciplinePromptRepository extends MongoRepository<DisciplinePrompt, String> {

    Optional<DisciplinePrompt> findByDiscipline(Discipline discipline);
}