from typing import Protocol
import requests
import json


class MailSenderProtocol(Protocol):
    def send_mail(self, to: str, subject: str, body: str, reason: str) -> None:
        pass


class SimpleMailSender:
    def send_mail(self, type: str = "", to: str = "", subject: str = "", body: str = "", reason: str = "", values: dict = {}) -> str:

        if "document_request" == type:
            return """
Dear Bikash Ranjan Pandey,

Congratulations! We’re pleased to inform you that you’ve been selected for the Software Engineer position following your interview. We were impressed by your skills and enthusiasm, and we’re excited to have you onboard.
To proceed, please submit required documents within 48 hrs. You’ll find the list of documents and instructions below.
1. Aadhar Card
2. PAN Card
3. Passport
4. Latest Payslip

Feel free to reach out if you have any questions. Welcome to the team!

Warm regards,
HR Team
Lloyds Technology Center
            """
        elif "offer_letter" == type:
            return """Dear Bikash Ranjan Pandey,
        
We’re delighted to offer you the position of Software Engineer at Lloyds Technology Center. Attached is your official offer letter outlining the terms and conditions of your employment.
Please review the document and confirm your acceptance.

We look forward to having you on the team!

Warm regards,
HR Team
Lloyds Technology Center
Hyderabad"""
        elif "initiate_bgv" == type:
            return """Dear BGV Team,

I hope this message finds you well.
Please initiate the background verification process for Bikash Ranjan Pandey, who has accepted our offer for the position of Software Engineer at Lloyds Technology Center.
Attached are the candidate’s details and required documents for your reference. Kindly confirm once the process is underway, and let us know if any additional information is needed.

Warm regards,
HR Team
Lloyds Technology Center
Hyderabad"""
        elif "confirm_joining_date" == type:
            return """
Dear Bikash Ranjan Pandey,

Thank you for your prompt response and for accepting our offer. We’re pleased to confirm your joining date as 1st of Aug 2025 for the position of Software Engineer at Lloyds Technology Center.
Please ensure all required documents are submitted prior to the joining date, and feel free to reach out if you have any questions or need further assistance.

We look forward to welcoming you onboard!

Warm regards,
HR Team
Lloyds Technology Center
Hyderabad"""
        elif "appointment_letter" == type:
            return """Dear Bikash Ranjan pandey,

We are pleased to offer you the position of Software Engineer at LLoyds. Your employment will commence on 1st of Aug 2025, and you will report to Koushik.
Your annual compensation will be as discussed, and further details regarding terms of employment, responsibilities, and benefits are enclosed.
Please find your appointment letter attched.

Warm regards,
HR Team
Lloyds Technology Center
Hyderabad"""
        elif "reconfirm_joing_date" == type:
            return "Dear [Candidate's Name],\n\nWe hope you're doing well.\n\nThis is a gentle reminder to reconfirm your joining date for the position of [Job Title] at [Company Name], scheduled for [Confirmed Start Date]. We are looking forward to welcoming you and beginning a rewarding journey together.\n\nPlease respond to this email confirming your availability, and let us know if you have any queries regarding the reporting details, onboarding documents, or other formalities.\n\nDetails:\n- Position: [Job Title]\n- Joining Date: [Confirmed Start Date]\n- Reporting Time & Location: [Time], [Office Address or Virtual Instructions]\n\nWishing you a smooth transition, and we’re excited to have you onboard!\n\nWarm regards,\n[Your Full Name]\nHR Team\n[Company Name]\n[Contact Information]"
        else:
            return body


class GMailSender:
    def __init__(self, mail_api_url: str = "http://localhost:8083/mail/sendEmail"):
        self.mail_api_url = mail_api_url

    def send_mail(self, type: str = "", to: str = "", subject: str = "", body: str = "", reason: str = "", values: dict = {}) -> str:
        # Prepare the API payload
        payload = {
            "to": to,
            "templateId": self._get_template_id(type),
            "subject": subject or self._get_default_subject(type),
            "body": body or self._get_template_body(type),
            "vars": values
        }

        try:
            response = requests.post(self.mail_api_url, json=payload)
            response.raise_for_status()
            return f"{body or self._get_template_body(type)}"
        except requests.exceptions.RequestException as e:
            return f"Failed to send email to {to}: {str(e)}"

    def _get_template_id(self, type: str) -> int:
        template_map = {
            "document_request": 1,
            "offer_letter": 2,
            "initiate_bgv": 0,
            "confirm_joining_date": 0,
            "appointment_letter": 0,
            "reconfirm_joing_date": 0
        }
        return template_map.get(type, 1)

    def _get_default_subject(self, type: str) -> str:
        subject_map = {
            "document_request": "Subject: Congratulations on Your Selection – Next Steps",
            "offer_letter": "Subject: Offer Letter for Software Engineer – Welcome Aboard",
            "initiate_bgv": "Subject: Request to Initiate Background Verification for Bikash Ranjan Pandey",
            "confirm_joining_date": "Subject: Confirmation of Joining Date – Bikash Ranjan Pandey",
            "appointment_letter": "Subject: Appointment Letter – Bikash Ranjan Pandey",
            "reconfirm_joing_date": "Joining Date Reconfirmation"
        }
        return subject_map.get(type, "HR Communication")

    def _get_template_body(self, type: str) -> str:
        # Return the same template bodies as SimpleMailSender for consistency
        simple_sender = SimpleMailSender()
        return simple_sender.send_mail(type=type)


# Change the default mail sender to use the API
mail_sender: MailSenderProtocol = GMailSender()
