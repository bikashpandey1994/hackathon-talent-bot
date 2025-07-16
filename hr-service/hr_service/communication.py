from typing import Protocol

class MailSenderProtocol(Protocol):
    def send_mail(self, to: str, subject: str, body: str, reason: str) -> None:
        pass

class SimpleMailSender:
    def send_mail(self, type: str="", to: str = "", subject: str= "", body: str="", reason: str="") -> None:
        print(f"Sending mail to {to} for reason '{reason}': {subject}\n{body}")

mail_sender: MailSenderProtocol = SimpleMailSender()