package com.lbg.onboardPro.db;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.lbg.hr.entity.Candidate;


public interface CandidateRepository extends JpaRepository<Candidate, Long> {

	// Custom query method to find orders by status
    List<Candidate> findByStatus(String status);
    
    // Custom query method to find candidates by email
    List<Candidate> findByEmail(String email);
    
    @Transactional
    @Modifying
    @Query("UPDATE Candidate c SET c.status = :status WHERE c.email = :email")
    int updateStatusByEmail(String email, String status);

}
