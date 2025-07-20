import os
import getpass
import base64

from enum import Enum
from typing import Optional
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain_community.document_loaders import PyPDFLoader



if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyCiAGnly6Bg8PrfHwF5RCJaFEjLZHDf9Uc"
    
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

class DocumentTypes(Enum):
    AADHAR_CARD = "Aadhar Card"
    PAN_CARD = "Pan Card"
    PASSPORT = "Passport"
    COMPENSATION_LETTER = "Compensation Letter"
    PAYSLIP = "Payslip"
      


class ScannedDocument(BaseModel):
    category: Optional[DocumentTypes] = Field(
        description="Document category. It should be Aadhar Card or Pan Card or Passport")
    name: Optional[str] = Field(
        description="Name of the card holder in the document if present")
    dob: Optional[str] = Field(
        description="Date of birth of the card holder in the document if present")
    address: Optional[str] = Field(
        description="Address of the card holder in the document if present")
    father_name: Optional[str] = Field(
        description="Father's Name of the card holder in the document if present")
    spouce_name: Optional[str] = Field(
        description="Spouce Name of the card holder in the document if present")
    confidence: float = Field(description="Confidence score between 0 and 1")
    
class PDFDocument(BaseModel):
    category: Optional[DocumentTypes] = Field(
        description="If this document is a payslip return Payslip if compensation/offer Letter return Compensation Letter")
    salary: Optional[str] = Field(
        description="If category Payslip, return salary")
    salary_date: Optional[str] = Field(
        description="If category Payslip, return salary paid date")
    compensation: Optional[str] = Field(
        description="If category Compensation letter, return compensation")


def fetch_document(doc_id: str) -> str:
    # May need modification in a cloud environment
    path = rf"C:\Users\bikas\OneDrive\Documents\All Documents\{doc_id}"
    with open(path, "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode("utf-8")
    return encoded

def fetch_pdf(doc_id:str) -> str:
    path = rf"C:\Users\bikas\OneDrive\Documents\All Documents\{doc_id}"
    loader = PyPDFLoader(path)
    docs = loader.load()
    return docs[0].page_content

def verify_document(doc_id: str):
    if doc_id.endswith(".pdf"):
        return verify_pdf(doc_id)
    elif doc_id.endswith(".jpg") or doc_id.endswith(".jpeg") or doc_id.endswith(".png"):
        return verify_image(doc_id)
    else:
        print(f"Could not classify document {doc_id}")
        return None
    
    
def verify_image(doc_id: str):
    encoded = fetch_document(doc_id)
    message = HumanMessage(content=[
        {"type": "text", "text": "Classify this document."},
        {"type": "image_url", "image_url": f"data:image/png;base64,{encoded}"}
    ])
    
    llmx = llm.with_structured_output(ScannedDocument)
    response = llmx.invoke([message])
    print(f"Document Details : {response}")
    return response

def verify_pdf(doc_id: str):
    text = fetch_pdf(doc_id)
    message = HumanMessage(content=[
        {"type": "text", "text": f"Classify this document:\n\n{text}"}
    ])
    
    llmx = llm.with_structured_output(PDFDocument)
    response = llmx.invoke([message])
    print(f"Document Details : {response}")
    return response
