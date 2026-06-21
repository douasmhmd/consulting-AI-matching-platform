package com.consulting.ai.dto;

import com.consulting.ai.client.dto.ConsultantDto;
import com.consulting.ai.model.Discipline;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResponse {
    private String interviewId;
    private String report;
    private Discipline recommendedDiscipline;
    private List<ConsultantDto> recommendedConsultants;
}