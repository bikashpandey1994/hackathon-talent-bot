# HR Service - Onboarding Automation

This service automates the HR onboarding process using LangGraph, FastAPI, and LLM-powered document and query handling.

---

## Features

- **Automated onboarding workflow** using a state machine (LangGraph)
- **Document classification** and verification using LLMs
- **Offer and joining management** via email templates
- **HR intervention** for manual steps or exceptions
- **Query answering** and candidate state summarization
- **REST API** for integration with other systems

---

## API Endpoints

### Onboarding Workflow

- `POST /init`  
  Initialize a new onboarding workflow for a candidate.  
  **Body:** `InitRequest`

- `POST /resume`  
  Resume an existing onboarding workflow.  
  **Body:** `ResumeRequest`

- `POST /hr-action`  
  Perform an HR action (e.g., custom message or intervention).  
  **Body:** `ActionRequest`

- `POST /state`  
  Get the current state of a candidate's onboarding workflow.  
  **Body:** `CandidateState`

- `POST /states`  
  Get the history of states for a candidate's onboarding workflow.  
  **Body:** `CandidateState`

- `GET /graph`  
  Get a PNG image of the onboarding workflow graph.

- `POST /summary`  
  Get a summary or answer a query about a candidate's onboarding state.  
  **Body:** `QueryRequest`

### Document Classification (Testing/Training)

- `POST /classify_doc`  
  Classify a document by its ID using the LLM document classifier.

- `POST /classify_document`  
  Classify an uploaded document image.

- `POST /train_classifier`  
  Train the document classifier with uploaded images and labels.

---

## Key Components

- **LangGraph Workflow:**  
  The onboarding process is modeled as a state machine with nodes for each step (document request, offer release, BGV, etc.).

- **Document Classifier:**  
  Uses LLMs and/or LayoutLMv3 for classifying and extracting information from candidate documents.

- **Mail Sender:**  
  Sends templated emails for each onboarding step.

- **HR Intervention:**  
  Allows manual HR input at any step where automation is insufficient.

- **Query Flow:**  
  Supports answering candidate/HR queries using RAG (Retrieval-Augmented Generation) over policy documents and candidate state.

---

## Data Models

- **CandidateState:**  
  Stores all relevant candidate information and workflow state.

- **InitRequest, ResumeRequest, ActionRequest, QueryRequest:**  
  TypedDicts defining the expected payloads for each endpoint.

---

## Setup

1. **Install dependencies:**  
   - Python 3.9+
   - `pip install -r requirements.txt`

2. **Set environment variables:**  
   - `GOOGLE_API_KEY` for LLM access
   - `OCR_AGENT` for OCR (optional)

3. **Run the service:**  
   ```
   uvicorn hr_service.main:app --reload
   ```

---

## Customization

- **Email Templates:**  
  Edit `hr_service/communication.py` to customize email content.

- **Workflow Logic:**  
  Modify nodes in `hr_service/process_flow/nodes.py` and the graph in `hr_service/process_flow/onboarding_graph.py`.

- **Document Classifier:**  
  Extend or retrain the classifier in `hr_service/document_classifier.py` or `hr_service/llm_document_classifier.py`.

---

## Example Usage

```bash
curl -X POST http://localhost:8000/init -H "Content-Type: application/json" -d '{"thread_id": "123", "name": "Alice", "email": "alice@example.com", "mobile_no": "1234567890"}'
```

---

## License

Proprietary - For internal hackathon/demo use only.
