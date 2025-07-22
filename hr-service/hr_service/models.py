from typing import Optional, TypedDict
from typing_extensions import Annotated
from hr_service.process_flow.states import States  # <-- Import States enum

class InitRequest(TypedDict, total=False):
    thread_id: Optional[str]
    name: str
    email: str
    mobile_no: str
    status: Optional[str]
    state: Optional[States]
    joining_details: Optional[dict]
    messages: Optional[list[str]]
    candidate_checkpoint_id: Optional[str]

class ResumeRequest(TypedDict, total=False):
    thread_id: Optional[str]
    state: Optional[States]
    messages: Optional[list[str]]
    docs: Optional[list[str]]
    
class QueryRequest(TypedDict, total=False):
    thread_id: Optional[str]
    summary: Optional[bool]
    query: Optional[str]

class ActionRequest(TypedDict, total=False):
    thread_id: Optional[str]
    name: Optional[str]
    email: Optional[str]
    mobile_no: Optional[str]
    status: Optional[str]
    state: Optional[States]
    messages: Optional[list[str]]
    candidate_checkpoint_id: Optional[str]
    joining_details: Optional[dict]
    hr_action: bool
    hr_message: Optional[str]
    hr_nextnode: str
    hr_justification: Optional[str]