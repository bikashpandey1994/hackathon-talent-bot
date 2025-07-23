package com.lbg.hr.service.impl;

import com.lbg.hr.dto.CandidateDetailsDTO;
import com.lbg.hr.dto.CandidateSummaryDTO;
import com.lbg.hr.dto.NotificationDTO;
import com.lbg.hr.entity.Candidate;
import com.lbg.hr.entity.Notification;
// import com.lbg.hr.enums.CandidateStatus; // Remove this import
import com.lbg.hr.repository.CandidateRepository;
import com.lbg.hr.repository.NotificationRepository;
import com.lbg.hr.service.CandidateService;
import com.lbg.hr.utils.CandidateExcelSheetParser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CandidateServiceImpl implements CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public void uploadCandidates(MultipartFile file) throws IOException {
        List<Candidate> candidates = CandidateExcelSheetParser.parseExcel(file.getInputStream());
        candidateRepository.saveAll(candidates);
    }

    @Override
    public List<CandidateSummaryDTO> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(candidate -> new CandidateSummaryDTO(
                        candidate.getId(),
                        candidate.getName(),
                        candidate.getGrade(),
                        candidate.getDesignation(),
                        candidate.getStatus(),
                        candidate.getExpectedJoiningDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CandidateDetailsDTO getCandidateDetailsById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found"));
        return new CandidateDetailsDTO(
                candidate.getId(),
                candidate.getName(),
                candidate.getGrade(),
                candidate.getDesignation(),
                candidate.getStatus(),
                candidate.getDateOfSelection(),
                candidate.getExpectedJoiningDate(),
                candidate.getJoiningDate(),
                candidate.getDateOfBirth(),
                candidate.getEmail(),
                candidate.getPhone(),
                candidate.getAddress(),
                candidate.getAadhaar(),
                candidate.getHrCoordinator()
        );
    }

    @Override
    public Map<String, String> getCandidateCountByExpectedJoiningDate(LocalDate expectedJoiningDate) {
        List<Candidate> candidates = candidateRepository.findByExpectedJoiningDate(expectedJoiningDate);
        long readyToJoin = candidates.stream()
                .filter(c -> "READY_TO_JOIN".equalsIgnoreCase(c.getStatus()))
                .count();
        long onboardingInProgress = candidates.size() - readyToJoin;

        Map<String, String> result = new HashMap<>();
        result.put("ReadyToJoin", String.valueOf(readyToJoin));
        result.put("OnboardingInProgress", String.valueOf(onboardingInProgress));
        return result;
    }

    @Override
    public List<CandidateSummaryDTO> getCandidatesByStatus(String status) {
        return candidateRepository.findByStatus(status);
    }

    @Override
    public Map<String, Long> getCandidateStatusStatistics() {
        List<Candidate> candidates = candidateRepository.findAll();
        Map<String, Long> statusCount = candidates.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getStatus() != null ? c.getStatus() : "UNKNOWN",
                        Collectors.counting()
                ));
        return statusCount;
    }

    @Override
    public List<Notification> fetchHRNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public void reviewHrNotification(@RequestBody NotificationDTO notificationDTO) {
        String email = notificationDTO.getEmail();
        //API to call HR-service to update the status using the status, email and message from NotificationDTO
        Notification notification = notificationRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Notification not found for email: " + email));
        notificationRepository.delete(notification);

    }
}
