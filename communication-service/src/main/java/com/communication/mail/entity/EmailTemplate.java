package com.communication.mail.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "email_templates")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailTemplate {

	/*
	 * @Id
	 * 
	 * @GeneratedValue(strategy = GenerationType.IDENTITY) private int
	 * emailTemplateId;
	 * 
	 * private String templateName;
	 * 
	 * private String templateSubject;
	 * 
	 * private String templateBody;
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "email_template_id")
	private int emailTemplateId;

	@Column(name = "template_name")
	private String templateName;

	@Column(name = "template_subject")
	private String templateSubject;

	@Column(name = "template_body")
	private String templateBody;


}
