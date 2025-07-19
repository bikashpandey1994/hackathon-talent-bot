
import os
import getpass
from typing import TypedDict
from operator import add
from typing_extensions import Annotated
from langgraph.types import interrupt, Command
from langgraph.graph import StateGraph, START, END
from langchain.chat_models import init_chat_model
from hr_service.process_flow import hr_services
from hr_service.process_flow.states import CandidateState, States
from ..communication import mail_sender

if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyCiAGnly6Bg8PrfHwF5RCJaFEjLZHDf9Uc"

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")


def initiate_onboarding(state: CandidateState):
    return {"state": States.ONBOARDING_INITIATED}


def request_document(state: CandidateState):

    mail_sender.send_mail(to=state["email"], type="document_request")
    return {"state": States.DOCUMENT_REQUESTED}


def wait_for_document(state: CandidateState):
    value = interrupt("Waiting for document through mail")
    return value


def validate_document(state: CandidateState):
    response = hr_services.verify_document_request_mail(state)
    if response.match and not response.denied and response.verified:
        return "release_offer"
    elif response.match and not response.verified:
        return "request_document"
    else:
        return "hr_intervention"


def release_offer(state: CandidateState):
    offer_details = hr_services.generate_offer_details(state)
    mail_sender.send_mail(
        to=state["email"], type="offer_letter", values=offer_details)
    return {"state": States.OFFER_RELEASED}


def wait_for_offer_acceptance(state: CandidateState):
    response = interrupt("Waiting offer acceptance through mail")
    return response


def validate_offer_acceptance(state: CandidateState):
    response = hr_services.verify_offer_acceptance_mail(state)
    if response.match and response.accepted:
        return "initiate_bgv"
    elif response.match and not response.accepted:
        return "hr_intervention"


def initiate_bgv(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="initiate_bgv")
    return {"state": States.BGV_INITIATED}


def wait_for_bgv_completion(state: CandidateState):
    response = interrupt("Waiting offer BGV result through mail")
    return response


def validate_bgv(state: CandidateState):
    response = hr_services.verify_bgv_mail(state)
    if response.match and response.passed:
        return "confirm_joining_date"
    elif response.match and not response.passed:
        return "hr_intervention"


def confirm_joining_date(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="confirm_joining_date")
    return {"state": States.CONFIRM_JOINING_DATE}


def wait_for_joining_date_confirmation(state: CandidateState):
    response = interrupt("Waiting for joining date confirmation through mail")
    return response


def validate_joining_date_confirmation(state: CandidateState):
    response = hr_services.verify_joining_date_confirmation_mail(state)
    if response.match and response.joining and response.confirmed:
        return "release_appointment_letter"
    else:
        return "hr_intervention"


def release_appointment_letter(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="appointment_letter")
    return {"state": States.APPOINTMENT_LETTER_RELEASED}


def reconfirm_joing_date(state: CandidateState):
    response = interrupt(
        "Waiting for sending joining date re-confirmation seven days before joining")
    mail_sender.send_mail(to=state["email"], type="appointment_letter")
    return {"state": States.RECONFIRM_JOINING_DATE}


def wait_for_reconfirmation_of_joing_date(state: CandidateState):
    response = interrupt(
        "Waiting for joining date re-confirmation through mail")
    return response


def verify_reconfirmation_of_joing_date(state: CandidateState):
    response = hr_services.verify_reconfirmation_of_joining_date_mail(state)

    if response.match and response.joining and response.confirmed:
        return "ready_to_join"
    else:
        return "hr_intervention"


def ready_to_join(state: CandidateState):
    return {"state": States.READY_TO_JOIN}


def candidate_joined(state: CandidateState):
    response = interrupt("Waiting for HR to mark candidate has joined or not")
    if response["state"] == "joined":
        mail_sender.send_mail(
            to=state["email"],
            subject="Welcome to the Company",
            body="Congratulations! You have successfully joined the company.",
            reason="Candidate Joined"
        )
        # Update candidate state to joined
        return {"state": States.CANDIDATE_JOINED}
    else:
        mail_sender.send_mail(
            to=state["email"],
            subject="Onboarding Failed",
            body="Dear [Candidate's Name],\n\nWe hope this message finds you well.\n\nAs per our last communication and the offer acceptance, your joining was scheduled for [Confirmed Start Date] for the position of [Job Title] at [Company Name]. However, we noticed that you have not reported as planned, and we haven’t heard back from you.\n\nWe understand that unforeseen circumstances can arise, and we would appreciate it if you could let us know the reason for your absence and your current status regarding the opportunity with us.\n\nPlease do respond by [Mention Deadline] so we can proceed accordingly.\n\nWe remain open to hearing from you and wish you the best regardless of your decision.\n\nWarm regards,\n[Your Full Name]\nHR Team\n[Company Name]\n[Contact Information]",
            reason="Onboarding Failed"
        )
        # Update candidate state to joined
        return {"state": States.END_ONBOARDING}


def end_onboarding(state: CandidateState):

    if state["status"] == "success":
        subject = "Onboarding Complete"
        body = "You are now ready to join the company."
        reason = "Onboarding Complete"
    else:
        subject = "Onboarding Failed"
        body = "Unfortunately, your onboarding process has failed. Please contact HR for further assistance."
        reason = "Onboarding Failed"

    mail_sender.send_mail(
        to=state["email"],
        subject=subject,
        body=body,
        reason=reason
    )
    return {"state": States.END_ONBOARDING}


def hr_intervention(state: CandidateState):
    response = interrupt("Waiting for HR input")
    return {"state": States.HR_INTERVENTION}


def hr_action(state: CandidateState):
    response = interrupt("Waiting for HR input")
    return "end_onboarding"
