package com.communication.mail.service.impl;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.communication.mail.config.MailConfig;
import com.communication.mail.dto.EmailPayload;
import com.communication.mail.dto.TemplateEmailRequest;
import com.communication.mail.entity.EmailTemplate;
import com.communication.mail.repository.EmailTemplateRepository;
import com.communication.mail.service.MailService;

import jakarta.mail.Address;
import jakarta.mail.BodyPart;
import jakarta.mail.Flags;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.Message.RecipientType;
import jakarta.mail.Multipart;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.search.FlagTerm;

/**
 * @author venkatesh penuboina
 */
@Service
public class MailServiceImpl implements MailService {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private EmailTemplateRepository templateRepository;

	private final Session emailSession;
	private final String senderEmail;

	@Value("${mail.username}")
	private String username;

	@Value("${mail.password}")
	private String password;

	@Value("${mail.imap.host}")
	private String host;

	@Value("${mail.imap.port}")
	private String port;

	@Value("${mail.folder}")
	private String folderName;

	@Value("${mail.download.folder}")
	private String downloadDir;

	@Value("${mail.consume.url}")
	private String endpointUrl;

	@Value("${mail.attachement.path}")
	private String attachementPath;

	@Value("${mail.appointmentletter.path}")
	private String attachementPath1;

	@Autowired
	public MailServiceImpl(Session emailSession, MailConfig mailConfig) {
		this.emailSession = emailSession;
		this.senderEmail = mailConfig.getSenderEmail();
	}

	private static final String SUCCESS_MESSAGE = "E-Mail sent successfully!";

	@Override
	public String sendEMail(String recipientMail, String subject, String body) {
		return sendEmail(recipientMail, subject, body);
	}

	@Override
	public String sendEMailWithAttachements(String recipientMail, String subject, String body, File attachment) {
		return sendEmailWithAttachment(recipientMail, subject, body, attachment);
	}

	private String sendEmail(String recipientMail, String subject, String body) {
		try {
			Message message = new MimeMessage(emailSession);
			message.setFrom(new InternetAddress(senderEmail));
			message.setRecipient(RecipientType.TO, new InternetAddress(recipientMail));
			message.setSubject(subject);
			message.setText(body);
			Transport.send(message);
			return SUCCESS_MESSAGE;
		} catch (Exception e) {
			e.printStackTrace();
			return e.getMessage();
		}
	}

	public String fetchAttachments() {
		try {
			Properties props = new Properties();
			props.put("mail.store.protocol", "imaps");
			props.put("mail.imaps.host", host);
			props.put("mail.imaps.port", port);
			props.put("mail.imaps.ssl.enable", "true");

			Session session = Session.getDefaultInstance(props);
			Store store = session.getStore("imaps");
			store.connect(host, username, password);

			Folder inbox = store.getFolder(folderName);
			inbox.open(Folder.READ_WRITE);
			// Message[] messages = inbox.getMessages();
			Message[] messages = inbox.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));

			Files.createDirectories(Paths.get(downloadDir));

			int saved = 0;

			for (Message message : messages) {

				EmailPayload emailPayload = new EmailPayload();
				List<String> messagesList = new ArrayList<>();
				List<String> docList = new ArrayList<>();

				boolean hasAttachment = false;

				// 📩 Read and print metadata
				String subject = message.getSubject();
				Address[] fromAddresses = message.getFrom();
				String sender = fromAddresses != null && fromAddresses.length > 0
						? ((InternetAddress) fromAddresses[0]).getAddress()
						: "Unknown";

				System.out.println("📨 Subject: " + subject);
				System.out.println("📬 From: " + sender);
				emailPayload.setEmail(sender);
				emailPayload.setThread_id(sender);

				// 📝 Extract and print body (plain text preferred)
				String bodyContent = "";

				if (message.isMimeType("text/plain")) {
					bodyContent = message.getContent().toString();
				} else if (message.isMimeType("multipart/*")) {

					Multipart multipart = (Multipart) message.getContent();

					for (int i = 0; i < multipart.getCount(); i++) {
						BodyPart part = multipart.getBodyPart(i);

						// 🧾 Extract plain text part
						if (part.isMimeType("text/plain") && bodyContent.isEmpty()) {
							bodyContent = part.getContent().toString();
							System.out.println("bodyContent :: " + bodyContent);
							// Attempt to extract only the reply portion (new content)
							String[] parts = bodyContent.split("(?m)^On .* wrote:$");
							String replyOnly = parts.length > 0 ? parts[0] : bodyContent;
							System.out.println("🗨️ Replied Content Only: " + replyOnly);

							messagesList.add(replyOnly);
						}



						// 📎 Save attachments
						if ("ATTACHMENT".equalsIgnoreCase(part.getDisposition())) {
							String fileName = part.getFileName();

							String uniqueName = System.currentTimeMillis() + "_" + fileName;

							InputStream is = part.getInputStream();
							Path filePath = Paths.get(downloadDir, uniqueName);
							Files.copy(is, filePath, StandardCopyOption.REPLACE_EXISTING);
							saved++;
							hasAttachment = true;
							System.out.println("📁 Saved attachment: " + uniqueName);
							docList.add(uniqueName);

						}
					}
				}

				if (hasAttachment) {
					message.setFlag(Flags.Flag.SEEN, true); // ✅ Mark as read
				}
				emailPayload.setMessages(messagesList);
				emailPayload.setDocs(docList);
				System.out.println("emailPayload :; " + emailPayload.toString());

				// emailPayload.setMessa
				// send this data to Hr Service like Map
				EmailPayload responseData= sendEmailPayload(emailPayload);
				//System.out.println("responseData :; "+responseData.toString());

			}

			inbox.close(false);
			store.close();

			return saved + " attachments saved in '" + downloadDir + "'";

		} catch (Exception e) {
			e.printStackTrace();
			return "Failed to fetch attachments: " + e.getMessage();
		}
	}

	private EmailPayload sendEmailPayload(EmailPayload payload) {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<EmailPayload> requestEntity = new HttpEntity<>(payload, headers);

		ResponseEntity<EmailPayload> response = restTemplate.postForEntity(endpointUrl, requestEntity,
				EmailPayload.class);

		return response.getBody();
	}

	private String sendEmailWithAttachment(String recipientMail, String subject, String body, File attachment) {
		try {
			Message message = new MimeMessage(emailSession);
			message.setFrom(new InternetAddress(senderEmail));
			message.setRecipient(RecipientType.TO, new InternetAddress(recipientMail));
			message.setSubject(subject);
			Multipart multipart = new MimeMultipart();
			MimeBodyPart textPart = new MimeBodyPart();
			textPart.setText(body);
			multipart.addBodyPart(textPart);
			MimeBodyPart attachmentPart = new MimeBodyPart();
			attachmentPart.attachFile(attachment);
			multipart.addBodyPart(attachmentPart);
			message.setContent(multipart);
			Transport.send(message);
			return SUCCESS_MESSAGE;
		} catch (Exception e) {
			e.printStackTrace();
			return e.getMessage();
		}
	}

	@Override
	public String sendTemplatedEmail(String recipientMail, Integer templateId, Map<String, String> variables) {
		EmailTemplate template = templateRepository.findById(templateId)
				.orElseThrow(() -> new RuntimeException("Template not found"));

		String subject = resolveTemplate(template.getTemplateSubject(), variables);
		String body = resolveTemplate(template.getTemplateBody(), variables);
		// File attachment = new File("C:/Users/venke/OneDrive/Documents/LTC/LTC.PNG");
		File attachment = new File("C:/Users/venke/OneDrive/Desktop/Hackathon 2025/LTC Tech Systems OfferLetter.pdf");

		variables.forEach((key, value) -> {
			if ("attachement".equalsIgnoreCase(key)) {
				sendEmailWithAttachment(recipientMail, subject, body, attachment); // Custom method for attachments
			} else {
				sendEmail(recipientMail, subject, body);
			}
		});

		return "Email sent successfully";
	}

	@Override
	public String sendEailtoEmployee(TemplateEmailRequest request) {
		String subject;
		String body;
		File attachment;

		if (request.getTemplateId() == 1) {
			attachment = new File(attachementPath);

		} else if (request.getTemplateId() == 2) {
			attachment = new File(attachementPath1);
		} else {
			attachment = null;
		}

		if (request.getTemplateId() != 0 && request.getTemplateId() > 3) {
			EmailTemplate template = templateRepository.findById(request.getTemplateId())
					.orElseThrow(() -> new RuntimeException("Template not found"));

			subject = resolveTemplate(template.getTemplateSubject(), request.getVars());
			body = resolveTemplate(template.getTemplateBody(), request.getVars());
		} else {

			subject = request.getSubject();
			body = request.getBody();

		}

		/*
		 * request.getVars().forEach((key, value) -> { if
		 * ("attachement".equalsIgnoreCase(key)) {
		 * sendEmailWithAttachment(request.getTo(), subject, body, attachment); //
		 * Custom method for attachments } else { sendEmail(request.getTo(), subject,
		 * body); } });
		 */
		
		if(request.getVars().get("attachement") != null && attachment !=null) {
			sendEmailWithAttachment(request.getTo(), subject, body, attachment); // Custom method for attachments
		} else {
			sendEmail(request.getTo(), subject, body);
		}

		return "Email sent successfully";
	}

	private String resolveTemplate(String template, Map<String, String> vars) {
		for (Map.Entry<String, String> entry : vars.entrySet()) {
			template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
		}
		return template;
	}

	@Scheduled(fixedRate = 60000) // every 60 seconds
	public void pollInboxForNewEmails() {
		System.out.println("📨 Scheduler started : " + System.currentTimeMillis());
		String result = fetchAttachments();
		System.out.println("📨 Poll Result: " + result);
		System.out.println("📨 Scheduler ended : " + System.currentTimeMillis());
	}
}
