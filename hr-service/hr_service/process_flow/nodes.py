
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
    return {"state": States.DOCUMENT_REQUESTED, "messages": [value]}

def validate_document(state: CandidateState):
    valid = hr_services.verify_response(state, "document_received")
    if valid:
        return "release_offer"
    else:
        return "request_document"

def release_offer(state: CandidateState):
    print(state["state"])
    return {"state": "offer_released"}

def wait_for_offer_acceptance(state: CandidateState):
    print(state["state"])
    return {"state": "offer_accepted"}

def validate_offer_acceptance(state: CandidateState):
        valid = True
        if valid:
            return "initiate_bgv"
        else:
            return "endOnboarding"

def initiate_bgv(state: CandidateState):
    print(state["state"])
    return {"state": "bgv_initiated"}

def wait_for_bgv_completion(state: CandidateState):
    print(state["state"])
    return {"state": "bgv_completed"}

def validate_bgv(state: CandidateState):
        valid = True
        if valid:
            return "confirm_joining_date"
        else:
            return "end_onboarding"

def confirm_joining_date(state: CandidateState):
    print(state["state"])
    return {"state": "confirm_joining_date"}

def wait_for_joining_date_confirmation(state: CandidateState):
    print(state["state"])
    return {"state": "joining_date_confirmed"}

def validate_joining_date_confirmation(state: CandidateState):
        valid = True
        if valid:
            return "release_appointment_letter"
        else:
            return "confirm_joining_date"

def release_appointment_letter(state: CandidateState):
    print(state["state"])
    return {"state": "appointment_letter_released"}   

def ready_to_join(state: CandidateState):
    print(state["state"])
    return {"state": "ready_to_join"}

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
    return {"state": "onboarding_completed"}

def follow_up(state: CandidateState):

    return {"state": "onboarding_completed"}