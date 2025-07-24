package com.communication.mail.dto;

import java.util.Map;

import lombok.Data;

@Data
public class TemplateEmailRequest {
	private String to;
	private Integer templateId;
	private String subject;
	private String body;
	private Map<String, String> vars;
}
