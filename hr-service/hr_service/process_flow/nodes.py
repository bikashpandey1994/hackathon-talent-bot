
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
    elif response.match and response.denied:
        return "end_onboarding"
    else:
        return "request_document"

def release_offer(state: CandidateState):
    offer_details = hr_services.generate_offer_details(state)
    mail_sender.send_mail(to=state["email"], type="offer_letter",values=offer_details)
    return {"state": States.OFFER_RELEASED}

def wait_for_offer_acceptance(state: CandidateState):
    response = interrupt("Waiting offer acceptance through mail")
    return response

def validate_offer_acceptance(state: CandidateState):
    response = hr_services.verify_offer_acceptance_mail(state)
    if response.match and response.accepted:
        return "initiate_bgv"
    elif response.match and not response.accepted:
        return "endOnboarding"
    else:
        return "follow_up"

def initiate_bgv(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="initiate_bgv")
    return {"state": States.BGV_INITIATED}

def wait_for_bgv_completion(state: CandidateState):
    response = interrupt("Waiting offer BGV result through mail")
    return response

def validate_bgv(state: CandidateState):
    response  = hr_services.verify_bgv_mail(state)
    if response.match and response.passed:
        return "confirm_joining_date"
    elif response.match and not response.passed:
        return "end_onboarding"
    else:
        return "follow_up"

def confirm_joining_date(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="confirm_joining_date")
    return {"state": States.CONFIRM_JOINING_DATE}

def wait_for_joining_date_confirmation(state: CandidateState):
    response = interrupt("Waiting for joining date confirmation through mail")
    return response

def validate_joining_date_confirmation(state: CandidateState):
    response = hr_services.verify_joining_date_confirmation_mail(state)
    if response.match and response.joining and response.joining_date:
        return "release_appointment_letter"
    else:
        return "confirm_joining_date"

def release_appointment_letter(state: CandidateState):
    mail_sender.send_mail(to=state["email"], type="appointment_letter")
    return {"state": States.APPOINTMENT_LETTER_RELEASED}   

def ready_to_join(state: CandidateState):
    return {"state": States.READY_TO_JOIN}

def end_onboarding(state: CandidateState):

    if state["status"] == "success":
         subject="Onboarding Complete"
         body="You are now ready to join the company."
         reason = "Onboarding Complete"
    else:
         subject="Onboarding Failed"
         body="Unfortunately, your onboarding process has failed. Please contact HR for further assistance."
         reason = "Onboarding Failed"

    mail_sender.send_mail(
        to=state["email"],
        subject=subject,
        body=body,
        reason=reason
    )
    return {"state": States.END_ONBOARDING}