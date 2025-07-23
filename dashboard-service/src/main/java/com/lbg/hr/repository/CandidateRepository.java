package com.lbg.hr.repository;

import com.lbg.hr.dto.CandidateSummaryDTO;
import com.lbg.hr.entity.Candidate;
import com.lbg.hr.enums.CandidateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
    public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    long countByStatus(String status);

    List<Candidate> findByExpectedJoiningDate(LocalDate date);

    List<CandidateSummaryDTO> findByStatus(String status);
}

