import os
import getpass
from typing import Optional
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = "AIzaSyCiAGnly6Bg8PrfHwF5RCJaFEjLZHDf9Uc"

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")


class DocumentResponse(BaseModel):
    match: bool = Field(description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    denied: bool = Field(description="True if the received email denies the request, otherwise False.")
    verified: Optional[str] = Field(default=None, description="If there is any query present in received email, answer to that query will be returned here.")
    follow_up: Optional[str] = Field(default=None, description="A personalised follow-up email to the candidate based on the last message received")
    query: Optional[str] = Field(default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(default=None, description="If there is any query present in received email, answer to that query will be returned here.")
    
    
class OfferResponse(BaseModel):
    match: bool = Field(description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    accepted: bool = Field(description="True if the received email accepts the offer, otherwise False.")
    follow_up: Optional[str] = Field(default=None, description="A personalised follow-up email to the candidate based on the last message received")
    query: Optional[str] = Field(default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(default=None, description="If there is any query present in received email, answer to that query will be returned here.")
    
class BGVResponse(BaseModel):
    match: bool = Field(description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    passed: bool = Field(description="True if the received email confirms completion of BGV, otherwise False.")
    follow_up: Optional[str] = Field(default=None, description="A personalised follow-up email to the BGV team based on the last message received")
    query: Optional[str] = Field(default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(default=None, description="If there is any query present in received email, answer to that query will be returned here.")
    
class JoiningDateResponse(BaseModel):
    match: bool = Field(description="True if the response logically acknowledges or addresses the original request; otherwise, False.")
    joining: bool = Field(description="True if the received email confirms if candidate is joining, otherwise False.")
    joining_date: bool = Field(description="joing date if the received email confirms if candidate is joining and it has joining date, otherwise False.")
    follow_up: Optional[str] = Field(default=None, description="A personalised follow-up email to the BGV team based on the last message received")
    query: Optional[str] = Field(default=None, description="If there is any query present in received email, it will be returned here.")
    query_response: Optional[str] = Field(default=None, description="If there is any query present in received email, answer to that query will be returned here.")
        
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
    
    prompt = ChatPromptTemplate.from_messages([("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(DocumentResponse)
    pipeline = prompt | structured_llm
    
    response = pipeline.invoke(input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)
    
    print(f"Document Request Mail Response from LLM: {response}")
    
    return response
  
def verify_documents(candidateState, response) -> DocumentResponse:
    print("Verifying documents...")
    # TODO: Implement the logic to verify documents
    # 1. Check if the received email contains any attachments.
    # 2. If attachments are present, verify their content.
    # 3. If no attachments are present, set response.verified to False.
    response.verified = True
    return response
  
def generate_offer_details(candidateState) -> dict:
    print("Offer letter attributes generated")
    return {"total_compensation": 1000000, 
            "fixed_compensation":9000000, 
            "variable_compensation":100000, 
            "joining_bonus": 100000, 
            "stock_options": 1000, 
            "joining_date": "2024-01-01", 
            "probation_period": 6, 
            "notice_period": 3}

def verify_offer_acceptance_mail(candidateState) -> OfferResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting an offer acceptance, and one received from the candidate—determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""
    
    prompt = ChatPromptTemplate.from_messages([("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(OfferResponse)
    pipeline = prompt | structured_llm
    
    response = pipeline.invoke(input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)
    
    print(f"Offer Request Mail Response from LLM: {response}")
    
    return response
  
def verify_bgv_mail(candidateState) -> BGVResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a BGV result, and one received from the BGV team —determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""
    
    prompt = ChatPromptTemplate.from_messages([("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(BGVResponse)
    pipeline = prompt | structured_llm
    
    response = pipeline.invoke(input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)
    
    print(f"BGV Request Mail Response from LLM: {response}")
    
    return response

def verify_joining_date_confirmation_mail(candidateState) -> JoiningDateResponse:
    last_message = candidateState["messages"][-1]
    second_last_message = candidateState["messages"][-2]

    system_message = """ Given two email texts—one sent by HR requesting a joining date confirmation, and one received from the candidate —determine whether the received email is a reply to the sent email.
        - Ignore metadata like sender, receiver, or email thread.
        - Focus solely on content matching and response relevance.
        - Output: True if the response logically acknowledges or addresses the original request; otherwise, False."""
    
    prompt = ChatPromptTemplate.from_messages([("system", system_message), ("human", "{input}")])
    structured_llm = llm.with_structured_output(JoiningDateResponse)
    pipeline = prompt | structured_llm
    
    response = pipeline.invoke(input="Sent mail: " + second_last_message + "\nReceived mail: " + last_message)
    
    print(f"Joining Date Confirmation Mail Response from LLM: {response}")
    
    return response