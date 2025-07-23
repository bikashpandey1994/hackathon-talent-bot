package com.lbg.hr.service;

import com.lbg.hr.dto.CandidateDetailsDTO;
import com.lbg.hr.dto.CandidateSummaryDTO;
import com.lbg.hr.dto.NotificationDTO;
import com.lbg.hr.entity.Candidate;
import com.lbg.hr.entity.Notification;
import com.lbg.hr.enums.CandidateStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CandidateService {
    public void uploadCandidates(MultipartFile file) throws IOException;

    public List<CandidateSummaryDTO> getAllCandidates();

    public CandidateDetailsDTO getCandidateDetailsById(Long id);

    public List<CandidateSummaryDTO> getCandidatesByStatus(String status);

    public Map<String, String>  getCandidateCountByExpectedJoiningDate(LocalDate expectedJoiningDate);

    public Map<String, Long> getCandidateStatusStatistics();

    public List<Notification> fetchHRNotifications();

    public void reviewHrNotification(@RequestBody NotificationDTO notificationDTO);

    }


