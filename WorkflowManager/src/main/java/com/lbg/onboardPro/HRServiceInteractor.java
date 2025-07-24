package com.lbg.onboardPro;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.lbg.hr.entity.Candidate;
import com.lbg.onboardPro.rest.HttpClientAsyncPost;

@Component
public class HRServiceInteractor {
	
	@Value("${hrService.url}")
    private String hrServiceUrl;

	public String interactWithInitAPI(Candidate candidate) {
		
		StringBuilder jsonBuilder = new StringBuilder();
		jsonBuilder.append("{")
		    .append("\"email\": \"").append(candidate.getEmail()).append("\",")
		    .append("\"name\": \"").append(candidate.getName()).append("\",")
		    .append("\"mobile_no\": \"").append(candidate.getPhone()).append("\",")
		    .append("\"thread_id\": \"").append(candidate.getEmail()).append("\",")
		    .append("\"joining_details\": {")
		        .append("\"position\": \"").append(candidate.getDesignation()).append("\",")
		        .append("\"compensation\": \"").append("100000").append("\",")
		        .append("\"expected_joining_date\": \"").append(candidate.getExpectedJoiningDate()).append("\",")
		        .append("\"joining_date\": \"").append(candidate.getJoiningDate()).append("\"")
		    .append("}")
		.append("}");

		String jsonBody = jsonBuilder.toString();

		
		return HttpClientAsyncPost.sendPostRequest(hrServiceUrl+"/init", jsonBuilder.toString());
		
	}
	
	public String interactWithResumeAPI(String message) {
		return HttpClientAsyncPost.sendPostRequest(hrServiceUrl+"/resume", message);
	}

}
