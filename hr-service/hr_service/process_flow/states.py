from typing import Optional, TypedDict
from typing_extensions import Annotated
from operator import add
from enum import Enum


class CandidateState(TypedDict, total=False):
    thread_id: Optional[str]
    name: str
    email: str
    mobile_no: str
    status: Optional[str]
    state: Optional["States"]
    messages: Annotated[list[str], add]
    candidate_checkpoint_id: Optional[str]
    joining_details: Optional[dict]
    


class GraphState(TypedDict):
    values: CandidateState
    next: str
    config: Optional[str]
    metadata: Optional[str]
    created_at: Optional[str]
    parent_config: Optional[str]
    tasks: Optional[list[str]]
    interrupts: Optional[list[str]]


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
    APPOINTMENT_LETTER_RELEASED = "APPOINTMENT_LETTER_RELEASED"
    RECONFIRM_JOINING_DATE = "RECONFIRM_JOINING_DATE"
    RECONFIRM_RECEIVED = "RECONFIRM_RECEIVED"
    JOINING_DATE_RECONFIRMED = "JOINING_DATE_RECONFIRMED"
    READY_TO_JOIN = "READY_TO_JOIN"
    CANDIDATE_JOINED = "CANDIDATE_JOINED"
    END_ONBOARDING = "END_ONBOARDING"
    HR_INTERVENTION = "HR_INTERVENTION"
