from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from hr_service.process_flow.states import CandidateState
from PIL import Image as PilImage
import io
from typing import List

from hr_service.process_flow.onboarding_graph import create_onboarding_graph
from hr_service.process_flow.langgraph_workflow import history, init, resume, perform_action, get_state
from hr_service.process_flow import hr_services
# from . import document_classifier
from . import llm_document_classifier
from .models import InitRequest, ResumeRequest, ActionRequest, QueryRequest
import os

if not os.environ.get("OCR_AGENT"):
    os.environ["OCR_AGENT"] = "unstructured.partition.utils.ocr_models.tesseract_ocr.OCRAgentTesseract"
    
if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyCiAGnly6Bg8PrfHwF5RCJaFEjLZHDf9Uc"

app = FastAPI()


@app.post("/init")
async def init_endpoint(request: InitRequest):
    """
    Initialize a new onboarding workflow for a candidate.
    """
    result = init(request)
    return {"result": result}


@app.post("/resume")
async def resume_endpoint(request: ResumeRequest):
    """
    Resume an existing onboarding workflow for a candidate.
    """
    result = resume(request)
    return {"result": result}


@app.post("/hr-action")
async def perform_hr_action(request: ActionRequest):
    """
    Perform an HR action (such as sending a custom message or intervention) in the onboarding workflow.
    """
    result = perform_action(request)
    return {"result": result}

@app.post("/summary")
async def graph_endpoint(request: QueryRequest):
    """
    Get a PNG image of the onboarding workflow graph.
    """
    result = hr_services.summarize_candidate_state(request)

    return {"result": result}


@app.post("/state")
async def state_endpoint(input_data: CandidateState):
    """
    Get the current state of the onboarding workflow for a candidate.
    """
    result = get_state(input_data)
    return {"result": result}


@app.post("/states")
async def states_endpoint(input_data: CandidateState):
    """
    Get the history of states for the onboarding workflow of a candidate.
    """
    result = history(input_data)
    return {"result": result}


@app.get("/graph")
async def graph_endpoint():
    """
    Get a PNG image of the onboarding workflow graph.
    """
    graph = create_onboarding_graph()
    img_bytes = graph.get_graph().draw_mermaid_png()
    return StreamingResponse(
        iter([img_bytes]),
        media_type="image/png"
    )