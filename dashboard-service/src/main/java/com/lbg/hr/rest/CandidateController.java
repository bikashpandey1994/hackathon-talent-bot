package com.lbg.hr.rest;

import com.lbg.hr.dto.CandidateDetailsDTO;
import com.lbg.hr.dto.CandidateSummaryDTO;
import com.lbg.hr.dto.NotificationDTO;
import com.lbg.hr.entity.Candidate;
import com.lbg.hr.entity.Notification;
import com.lbg.hr.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    public CandidateController(CandidateService service) {
        this.candidateService = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            candidateService.uploadCandidates(file);
            System.out.println("Candidates uploaded successfully: ");
            HttpHeaders headers = new HttpHeaders();
            //headers.add("Access-Control-Allow-Origin", "*");
            return new ResponseEntity<>("Upload successful",headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Upload failed: " + e.getMessage());
        }

    }

    @GetMapping()
    public ResponseEntity<List<CandidateSummaryDTO>> getAllCandidates() {
        List<CandidateSummaryDTO> candidates = candidateService.getAllCandidates();
        HttpHeaders headers = new HttpHeaders();
        //headers.add("Access-Control-Allow-Origin", "*");
        return new ResponseEntity<>(candidates,headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/details")
    public CandidateDetailsDTO getCandidateDetailsById(@PathVariable Long id) {
        return candidateService.getCandidateDetailsById(id);
    }

    @GetMapping("/joining-date/statistics")
    public Map<String, String> getCandidatesByExpectedJoiningDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return candidateService.getCandidateCountByExpectedJoiningDate(date);
    }

    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {
        return candidateService.getCandidateStatusStatistics();
    }

    @GetMapping("/fetchHRNotifications")
    public List<Notification> fetchHRNotifications() {
        return candidateService.fetchHRNotifications();
    }

    @GetMapping("/status")
    public List<CandidateSummaryDTO> getCandidatesByStatus(@RequestParam String status) {
        return candidateService.getCandidatesByStatus(status);
    }

    @PostMapping("/reviewHrNotification")
    public ResponseEntity<?> reviewHrNotification(@RequestBody NotificationDTO notificationDTO) {
        candidateService.reviewHrNotification(notificationDTO);
        return null;
    }

}
