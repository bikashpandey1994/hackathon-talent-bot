package com.lbg.onboardPro.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.lbg.hr.enums.CandidateStatus;
import com.lbg.onboardPro.Manager;
import com.lbg.onboardPro.db.CandidateRepository;

@Component
public class CandidatePollingScheduler {
	
	private final CandidateRepository candidateRepository;
	@Autowired
	private Manager manager;
	
	/**
	 * Constructor for CandidatePollingScheduler.
	 * 
	 * @param candidateRepository The repository to interact with candidate data.
	 */
	public CandidatePollingScheduler(CandidateRepository candidateRepository) {
		this.candidateRepository = candidateRepository;
	}
	
	
	/**
	 * Method to poll candidates and perform actions based on their status. This
	 * method is intended to be scheduled at regular intervals.
	 */
	@Scheduled(fixedDelay = 5000, initialDelay = 1000)
    @Transactional 
	public void pollCandidates() {
		// Fetch candidates with status "PENDING"
		var pendingCandidates = candidateRepository.findByStatus(CandidateStatus.SELECTED.name());

		// Process each pending candidate
		for (var candidate : pendingCandidates) {
			manager.handleNewCandidate(candidate);
			
			// Additional actions can be added here for other statuses
		}

		// Log or handle any other necessary operations after polling
		System.out.println("Polling completed for candidates.");
	}
	

}
