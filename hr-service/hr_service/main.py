from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from hr_service.process_flow.states import CandidateState
from PIL import Image as PilImage
import io
from typing import List

from hr_service.process_flow.hr_graph import create_hr_graph
from hr_service.process_flow.langgraph_workflow import history, init, resume, perform_hr_action, get_state
from . import document_classifier
from .models import InitRequest, ResumeRequest, ActionRequest

app = FastAPI()


@app.post("/init")
async def init_endpoint(request: InitRequest):
    result = init(request)
    return {"result": result}


@app.post("/resume")
async def resume_endpoint(request: ResumeRequest):
    result = resume(request)
    return {"result": result}


@app.post("/hr-action")
async def perform_hr_action(request: ActionRequest):
    result = perform_hr_action(request)
    return {"result": result}


@app.post("/state")
async def state_endpoint(input_data: CandidateState):
    result = get_state(input_data)
    return {"result": result}


@app.post("/states")
async def states_endpoint(input_data: CandidateState):
    result = history(input_data)
    return {"result": result}


@app.get("/graph")
async def graph_endpoint():
    graph = create_hr_graph()
    img_bytes = graph.get_graph().draw_mermaid_png()
    return StreamingResponse(
        iter([img_bytes]),
        media_type="image/png"
    )


@app.post("/classify_document")
async def classify_document_endpoint(file: UploadFile = File(...)):
    # Read image file
    contents = await file.read()
    image = PilImage.open(io.BytesIO(contents)).convert("RGB")
    # Preprocess document to get words and boxes
    words, boxes = document_classifier.preprocess_document(image)
    # Extract embeddings
    embeddings = document_classifier.extract_layoutlmv3_embeddings(
        image, words, boxes)
    # Classify document
    label = document_classifier.classify_document_embeddings(embeddings)
    return {"document_type": label}


@app.post("/train_classifier")
async def train_classifier_endpoint(
    files: List[UploadFile] = File(...),
    labels: List[int] = Form(...)
):
    """
    Train the document classifier with uploaded images and labels.
    """
    images = []
    for file in files:
        contents = await file.read()
        image = PilImage.open(io.BytesIO(contents)).convert("RGB")
        images.append(image)
    # Pair images and labels
    image_label_pairs = list(zip(images, labels))
    document_classifier.train_classifier(image_label_pairs)
    return {"status": "training complete"}
