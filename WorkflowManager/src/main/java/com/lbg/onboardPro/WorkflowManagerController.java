package com.lbg.onboardPro;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WorkflowManagerController {
	
	@Autowired
	private Manager manager;

	@GetMapping("/status")
	public String getStatus() {
		return "Workflow Manager is running";
	}
	
	@PostMapping("/emailRecieved")
	public void emailReceived(@RequestBody String body) {
		manager.handleEmailReply(body);
	}
}
