package com.consulting.ai.client;

import com.consulting.ai.client.dto.ConsultantDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;

@Component
public class ConsultantClient {

    private final RestClient restClient;

    public ConsultantClient(@Value("${services.consultant-url}") String consultantUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(consultantUrl)
                .build();
    }

    // Recupere les consultants approuves d'une discipline donnee
    public List<ConsultantDto> findByDiscipline(String discipline, String jwt) {
        ConsultantDto[] result = restClient.get()
                .uri("/api/consultants?discipline={discipline}", discipline)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
                .retrieve()
                .body(ConsultantDto[].class);

        return result != null ? Arrays.asList(result) : List.of();
    }
}