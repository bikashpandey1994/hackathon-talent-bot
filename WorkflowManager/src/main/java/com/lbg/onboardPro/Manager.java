package com.lbg.onboardPro;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lbg.hr.entity.Candidate;
import com.lbg.hr.enums.CandidateStatus;
import com.lbg.onboardPro.db.CandidateRepository;
import com.lbg.onboardPro.db.NotificationRepository;

@Component
public class Manager {
	
	@Autowired
	private CandidateRepository candidateRepository;
	@Autowired
	private NotificationRepository notificationRepository;
	@Autowired
	private HRServiceInteractor HRServiceInteractor;
	
	public void handleNewCandidate(Candidate candidate) {
		try {
			String body = HRServiceInteractor.interactWithInitAPI(candidate);
			SaveToDB(body);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	
	
	public void handleEmailReply(String message) {
		try {
			String body = HRServiceInteractor.interactWithResumeAPI(message);
			SaveToDB(body);
		} catch (Exception e) {
			// TODO: handle exception
		}
		
	}
	
	private void SaveToDB(String body) throws IOException {
		String status = Utils.getDetailsFromBody(body, "state");
		if(Utils.isValidStatus(status)) {
		 candidateRepository.updateStatusByEmail("email", status);
		}
		
		String state = Utils.getDetailsFromBody(body, "status");
		if(state.equals(CandidateStatus.HR_INTERVENTION.toString())) {
			notificationRepository.updateMessageByEmail(Utils.getDetailsFromBody(body, "email"), Utils.getDetailsFromBody(body, "message"));
		}
	}
	
	

}
