import os
import getpass
from typing import Optional
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from . import onboarding_graph

from .. import llm_document_classifier


if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyCiAGnly6Bg8PrfHwF5RCJaFEjLZHDf9Uc"

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")


class DocumentResponse(BaseModel):
    match: bool = Field(
        description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    denied: bool = Field(
        description="True if the received email denies the request, otherwise False.")
    verified: Optional[str] = Field(
        default=None, description="If there is any query present in received email, answer to that query will be returned here.")
    follow_up: Optional[str] = Field(
        default=None, description="A personalised follow-up email to the candidate based on the last message received")
    query: Optional[str] = Field(
        default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(
        default=None, description="If there is any query present in received email, answer to that query will be returned here.")


class OfferResponse(BaseModel):
    match: bool = Field(
        description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    accepted: bool = Field(
        description="True if the received email accepts the offer, otherwise False.")
    follow_up: Optional[str] = Field(
        default=None, description="A personalised follow-up email to the candidate based on the last message received")
    query: Optional[str] = Field(
        default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(
        default=None, description="If there is any query present in received email, answer to that query will be returned here.")


class BGVResponse(BaseModel):
    match: bool = Field(
        description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    passed: bool = Field(
        description="True if the received email confirms completion of BGV, otherwise False.")
    follow_up: Optional[str] = Field(
        default=None, description="A personalised follow-up email to the BGV team based on the last message received")
    query: Optional[str] = Field(
        default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(
        default=None, description="If there is any query present in received email, answer to that query will be returned here.")


class JoiningDateResponse(BaseModel):
    match: bool = Field(
        description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    joining: bool = Field(
        description="True if the received email confirms if candidate is joining, otherwise False.")
    joining_date: bool = Field(
        description="joinig date if the received email confirms if candidate is joining and it has joining date, otherwise False.")
    confirmed: bool = Field(
        description="True,If joining date in received email matches joing date in sent mail , otherwise False.")
    follow_up: Optional[str] = Field(
        default=None, description="A personalised follow-up email to the BGV team based on the last message received")
    query: Optional[str] = Field(
        default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(
        default=None, description="If there is any query present in received email, answer to that query will be returned here.")


def verify_document_request_mail(candidateState) -> DocumentResponse:

    response = verify_context(candidateState)
    if response.match:
        response = verify_documents(candidateState, response)
    return response


def verify_context(candidateState) -> DocumentResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a document, and one received from the candidate—determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(DocumentResponse)
    pipeline = prompt | structured_llm

    response = pipeline.invoke(
        input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)

    return response


def verify_documents(candidateState, response) -> DocumentResponse:
    documents_required = ["Aadhar Card", "Pan Card",
                          "Passport", "Payslip", "Compensation Letter"]
    for doc in candidateState["docs"]:
        document = llm_document_classifier.verify_document(doc)
        print(f"Removing Document : {document.category.value}")
        documents_required.remove(document.category.value)

    if not documents_required:
        response.verified = True
    else:
        response.verified = False
    return response


def generate_offer_details(candidateState) -> dict:

    offer_details = candidateState.get("joining_details", {})
    # Additional offer details can be added here
    offer_details["probation_period"] = "180 days"
    offer_details["notice_period"] = "60 days"

    return offer_details


def verify_offer_acceptance_mail(candidateState) -> OfferResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting an offer acceptance, and one received from the candidate—determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(OfferResponse)
    pipeline = prompt | structured_llm

    response = pipeline.invoke(
        input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)

    return response


def verify_bgv_mail(candidateState) -> BGVResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a BGV result, and one received from the BGV team —determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(BGVResponse)
    pipeline = prompt | structured_llm

    response = pipeline.invoke(
        input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)

    return response


def verify_joining_date_confirmation_mail(candidateState) -> JoiningDateResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a joining date confirmation, and one received from the candidate —determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(JoiningDateResponse)
    pipeline = prompt | structured_llm

    response = pipeline.invoke(
        input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)

    return response


def verify_reconfirmation_of_joining_date_mail(candidateState) -> JoiningDateResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a reconfirmation of joining date, and one received from the candidate —determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(JoiningDateResponse)
    pipeline = prompt | structured_llm

    response = pipeline.invoke(
        input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)

    return response


def summarize_candidate_state(state) -> str:
    """
    Summarizes the candidate's state for HR intervention.
    """

    graph = onboarding_graph.get_onboarding_graph()
    config = {"configurable": {"thread_id": state["thread_id"]}}
    states = list(graph.get_state_history(config))
    summary = ""
    if states:
        candidateState = states[0].values
        summary = f"Candidate Name: {candidateState['name']}\n"
        summary += f"Email: {candidateState['email']}\n"
        summary += f"Mobile No: {candidateState['mobile_no']}\n"
        summary += f"Current State: {candidateState['state'].value if candidateState['state'] else 'Unknown'}\n"
        summary += "Joining Details:\n"
        for key, value in candidateState["joining_details"].items():
            summary += f"  {key}: {value}\n"

    for candidateState in states:
        summary += f"Messages: {', '.join(candidateState.values['messages'])}\n"

    response = llm.invoke(
        f"Create a concise summary of the candidate based on following context: {summary}"
    )

    is_summary_request = state.get("summary", False)
    if is_summary_request:
        return response.content
    elif state.get("query"):
        response = llm.invoke(
        f"Answer this question: {state.get('query', '')} based on the following context: {summary}")
        return response.content
    else:
        return "No summary or query provided. Please provide a valid request." 
