package com.communication.mail.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.communication.mail.dto.TemplateEmailRequest;
import com.communication.mail.service.MailService;

@RestController
@RequestMapping("/mail")
public class MailController {

	@Autowired
	private MailService mailService;	
	
	@PostMapping("/send")
    public ResponseEntity<String> sendEmail(
        @RequestParam String to,
        @RequestParam String subject,
        @RequestParam String body) {
		mailService.sendEMail(to, subject, body);
        return ResponseEntity.ok("Mail sent successfully!");
    }
	
	
	@GetMapping("/sendEmailTEST")
    public ResponseEntity<String> sendEmailTest() {
		mailService.sendEMail("hackathonLTC2025@gmail.com", "LTC EMAIL TEST", "Sending email from new communication service");
        return ResponseEntity.ok("EMail sent successfully!");
    }
	
	@GetMapping("/sendTemplate")
	public ResponseEntity<String> sendTemplateEmail(@RequestParam String to,
	                                                @RequestParam Integer templateId,
	                                                @RequestParam Map<String, String> vars) {
	    return ResponseEntity.ok(mailService.sendTemplatedEmail(to, templateId, vars));
	}

	@PostMapping("/sendEmailTemplate")
	public ResponseEntity<String> sendEmailTemplate(@RequestBody TemplateEmailRequest request) {
	    String to = request.getTo();
	    Integer templateId = request.getTemplateId();
	    Map<String, String> vars = request.getVars();

	    return ResponseEntity.ok(mailService.sendTemplatedEmail(to, templateId, vars));
	}

	
	@PostMapping("/sendEmailAttachement")
	public ResponseEntity<String> sendEmailAttachement(@RequestBody TemplateEmailRequest request) {
	    String to = request.getTo();
	    Integer templateId = request.getTemplateId();
	    Map<String, String> vars = request.getVars();

	    return ResponseEntity.ok(mailService.sendTemplatedEmail(to, templateId, vars));
	}
	
	
	@PostMapping("/sendEmail")
	public ResponseEntity<String> sendEmail(@RequestBody TemplateEmailRequest request) {
	    return ResponseEntity.ok(mailService.sendEailtoEmployee(request));
	}
	

	@GetMapping("/readAttachments")
    public ResponseEntity<String> readAndDownloadAttachments() {
        String result = mailService.fetchAttachments();
        return ResponseEntity.ok(result);
    }
	
	@GetMapping("/test")
    public ResponseEntity<String> Test() {
        return ResponseEntity.ok("TEST Working successfully!");
    }
	
}
