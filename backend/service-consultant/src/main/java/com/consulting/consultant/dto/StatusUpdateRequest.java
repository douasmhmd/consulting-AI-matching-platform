package com.consulting.consultant.dto;

import com.consulting.consultant.model.ConsultantStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private ConsultantStatus status;
}