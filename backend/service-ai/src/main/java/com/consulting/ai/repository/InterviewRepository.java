package com.consulting.ai.repository;

import com.consulting.ai.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InterviewRepository extends MongoRepository<Interview, String> {

    List<Interview> findByClientId(String clientId);
}