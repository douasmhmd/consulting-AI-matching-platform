package com.consulting.ai.service;
import com.consulting.ai.client.ConsultantClient;
import com.consulting.ai.client.dto.ConsultantDto;
import com.consulting.ai.dto.MatchingResponse;
import com.consulting.ai.model.Discipline;
import com.consulting.ai.model.Interview;
import com.consulting.ai.model.InterviewStatus;
import com.consulting.ai.model.Message;
import com.consulting.ai.client.OpenAiClient;
import com.consulting.ai.client.dto.ChatMessage;
import com.consulting.ai.repository.InterviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {
    private final ConsultantClient consultantClient;
    private final OpenAiClient openAiClient;
    private final InterviewRepository interviewRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Demarre un nouvel entretien : l'IA se presente et pose la premiere question
    public Interview startInterview(String clientId) {
        Interview interview = Interview.builder()
                .clientId(clientId)
                .messages(new ArrayList<>())
                .status(InterviewStatus.IN_PROGRESS)
                .build();

        // Construire la conversation pour OpenAI
        List<ChatMessage> chat = new ArrayList<>();
        chat.add(new ChatMessage("system", AiPrompts.INTERVIEW_SYSTEM_PROMPT));

        // L'IA produit son premier message
        String aiReply = openAiClient.chat(chat);

        // Enregistrer le message de l'assistant
        interview.getMessages().add(Message.builder()
                .role("assistant").content(aiReply).build());

        return interviewRepository.save(interview);
    }
    // Apres le rapport, propose des consultants de la discipline recommandee
    public MatchingResponse getMatching(String interviewId, String clientId, String jwt) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        if (!interview.getClientId().equals(clientId)) {
            throw new RuntimeException("Cet entretien ne vous appartient pas");
        }
        if (interview.getStatus() != InterviewStatus.COMPLETED) {
            throw new RuntimeException("Le rapport n'a pas encore ete genere");
        }

        // Appeler le Service Consultant pour la discipline recommandee
        List<ConsultantDto> consultants = consultantClient.findByDiscipline(
                interview.getRecommendedDiscipline().name(), jwt);

        return new MatchingResponse(
                interview.getId(),
                interview.getReport(),
                interview.getRecommendedDiscipline(),
                consultants
        );
    }

    // Le client envoie une reponse, l'IA pose la question suivante
    public Interview sendMessage(String interviewId, String clientId, String userMessage) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        if (!interview.getClientId().equals(clientId)) {
            throw new RuntimeException("Cet entretien ne vous appartient pas");
        }
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new RuntimeException("Cet entretien est termine");
        }

        // Ajouter le message du client
        interview.getMessages().add(Message.builder()
                .role("user").content(userMessage).build());

        // Reconstruire toute la conversation pour OpenAI
        List<ChatMessage> chat = buildChatHistory(interview);

        // Reponse de l'IA
        String aiReply = openAiClient.chat(chat);

        interview.getMessages().add(Message.builder()
                .role("assistant").content(aiReply).build());

        return interviewRepository.save(interview);
    }

    // Genere le rapport final et la discipline recommandee
    public Interview generateReport(String interviewId, String clientId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        if (!interview.getClientId().equals(clientId)) {
            throw new RuntimeException("Cet entretien ne vous appartient pas");
        }

        // Reconstruire la conversation + demander le rapport JSON
        List<ChatMessage> chat = buildChatHistory(interview);
        chat.add(new ChatMessage("system", AiPrompts.REPORT_SYSTEM_PROMPT));

        String jsonReply = openAiClient.chat(chat);

        // Parser le JSON retourne par l'IA
        try {
            // Nettoyer d'eventuels ```json ... ```
            String cleaned = jsonReply.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode node = objectMapper.readTree(cleaned);

            String disciplineStr = node.get("discipline").asText();
            String report = node.get("report").asText();

            interview.setRecommendedDiscipline(Discipline.valueOf(disciplineStr));
            interview.setReport(report);
            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setCompletedAt(Instant.now());
        } catch (Exception e) {
            throw new RuntimeException("Impossible d'analyser le rapport genere : " + e.getMessage());
        }

        return interviewRepository.save(interview);
    }

    public Interview getInterview(String interviewId, String clientId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));
        if (!interview.getClientId().equals(clientId)) {
            throw new RuntimeException("Cet entretien ne vous appartient pas");
        }
        return interview;
    }

    public List<Interview> getMyInterviews(String clientId) {
        return interviewRepository.findByClientId(clientId);
    }

    // Transforme les messages stockes en format attendu par OpenAI
    private List<ChatMessage> buildChatHistory(Interview interview) {
        List<ChatMessage> chat = new ArrayList<>();
        chat.add(new ChatMessage("system", AiPrompts.INTERVIEW_SYSTEM_PROMPT));
        for (Message m : interview.getMessages()) {
            chat.add(new ChatMessage(m.getRole(), m.getContent()));
        }
        return chat;
    }
}