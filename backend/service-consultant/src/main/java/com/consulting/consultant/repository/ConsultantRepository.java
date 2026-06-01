package com.consulting.consultant.repository;

import com.consulting.consultant.model.Consultant;
import com.consulting.consultant.model.ConsultantStatus;
import com.consulting.consultant.model.Discipline;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultantRepository extends MongoRepository<Consultant, String> {

    Optional<Consultant> findByUserId(String userId);

    boolean existsByUserId(String userId);

    List<Consultant> findByStatus(ConsultantStatus status);

    List<Consultant> findByDisciplineAndStatus(Discipline discipline, ConsultantStatus status);
}