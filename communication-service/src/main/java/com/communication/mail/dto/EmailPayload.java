package com.communication.mail.dto;

import java.util.List;

import lombok.Data;

@Data
public class EmailPayload {
	private String thread_id;
	private String email;
	private List<String> messages;
	private List<String> docs;
}
