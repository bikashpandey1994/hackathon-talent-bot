package com.lbg.onboardPro;

import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lbg.hr.enums.CandidateStatus;

public class Utils {
	
	public static String getDetailsFromBody(String body, String field) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(body);
        JsonNode fieldNode = root.path("result").path(field);
        return fieldNode.isNull() ? null : fieldNode.asText();
	}
	
	public static boolean isValidStatus(String status) {
	    try {
	        CandidateStatus.valueOf(status);
	        return true;
	    } catch (IllegalArgumentException e) {
	        return false;
	    }
	}


}
