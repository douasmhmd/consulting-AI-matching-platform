package com.consulting.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String role;      // "user" ou "assistant"
    private String content;
    @Builder.Default
    private Instant timestamp = Instant.now();
}