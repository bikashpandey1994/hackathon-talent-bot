package com.lbg.onboardPro;

import java.io.IOException;

import com.lbg.hr.entity.Notification;
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
		String email = Utils.getDetailsFromBody(body, "email");
		if(Utils.isValidStatus(status)) {
		 candidateRepository.updateStatusByEmail(email, status);
		}

		if(body.contains("Waiting for HR input")){
			notificationRepository.updateMessageByEmail(email, Utils.getDetailsFromBody(body, "message"));
			Notification notification = new Notification();
			notification.setEmail(email);
			notification.setMessage("Bikash Rejected Offer");
			notificationRepository.saveNotification(notification);
		}
	}
}
