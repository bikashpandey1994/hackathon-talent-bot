package com.communication.mail.service;

import java.io.File;
import java.util.Map;

import com.communication.mail.dto.TemplateEmailRequest;

/**
 * @author venkatesh Penuboina
 */

public interface MailService {

	String sendEMail(String recipientMail, String subject, String body);

	String sendEMailWithAttachements(String recipientMail, String subject, String body, File attachment);

	String sendTemplatedEmail(String recipientMail, Integer templateId, Map<String, String> variables);
	
	String sendEailtoEmployee(TemplateEmailRequest emailRequest);
	
	public String fetchAttachments();
}
