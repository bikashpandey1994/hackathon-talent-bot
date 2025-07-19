from typing import Optional, TypedDict
from typing_extensions import Annotated
from hr_service.process_flow.states import States  # <-- Import States enum

class InitRequest(TypedDict, total=False):
    thread_id: Optional[str]
    name: str
    email: str
    mobile_no: str
    status: Optional[str]
    state: Optional[States]  # <-- Use States, not "States"
    joining_details: Optional[dict]
    messages: Optional[list[str]]
    candidate_checkpoint_id: Optional[str]

class ResumeRequest(TypedDict, total=False):
    thread_id: Optional[str]
    state: Optional[States]  # <-- Use States, not "States"
    messages: Optional[list[str]]

class ActionRequest(TypedDict, total=False):
    thread_id: Optional[str]
    name: str
    email: str
    mobile_no: str
    status: Optional[str]
    state: Optional[States]  # <-- Use States, not "States"
    messages: Optional[list[str]]
    candidate_checkpoint_id: Optional[str]
    joining_details: Optional[dict]