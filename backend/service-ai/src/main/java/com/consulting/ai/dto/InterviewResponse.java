package com.consulting.ai.dto;

import com.consulting.ai.model.Discipline;
import com.consulting.ai.model.InterviewStatus;
import com.consulting.ai.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private String id;
    private String clientId;
    private List<Message> messages;
    private InterviewStatus status;
    private String report;
    private Discipline recommendedDiscipline;
    private Instant createdAt;
    private Instant completedAt;
}