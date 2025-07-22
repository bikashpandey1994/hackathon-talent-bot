from .main import app

@app.post("/classify_doc")
async def classify_document(doc_id:str):
    """
    Classify a document by its ID using the LLM document classifier.
    """
    result = llm_document_classifier.verify_document(doc_id)
    return {"result": result}


@app.post("/classify_document")
async def classify_document_endpoint(file: UploadFile = File(...)):
    """
    Classify an uploaded document image using the document classifier.
    """
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
