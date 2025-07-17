from typing import Optional, TypedDict
from typing_extensions import Annotated
from operator import add
from enum import Enum

class CandidateState(TypedDict):
    messages: Annotated[list[str], add]
    email: str
    status: Optional[str]
    state: Optional["States"]
    thread_id: Optional[str]

class States(Enum):
    ONBOARDING_INITIATED = "ONBOARDING_INITIATED"
    DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED"
    DOCUMENT_RECEIVED = "DOCUMENT_RECEIVED"
    OFFER_RELEASED = "OFFER_RELEASED"   
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    BGV_INITIATED = "BGV_INITIATED"
    BGV_COMPLETED = "BGV_COMPLETED"
    CONFIRM_JOINING_DATE = "CONFIRM_JOINING_DATE"
    JOINING_DATE_CONFIRMED = "JOINING_DATE_CONFIRMED"
    APPOINTMENT_LETTER_RELEASED="APPOINTMENT_LETTER_RELEASED"
    READY_TO_JOIN="READY_TO_JOIN"
    END_ONBOARDING = "END_ONBOARDING"
