import os
from langgraph.graph import StateGraph, START, END
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import InMemorySaver
from hr_service.process_flow.states import QueryState, CandidateState, States
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_chroma import Chroma
from langchain import hub
from langchain_community.document_loaders import PyPDFLoader

if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDexZthIVwq3kH7zJ_cueWekuIUqhl012A"


file_path = r"C:\Users\bikas\OneDrive\Documents\Leave-and-Holiday-Policy.pdf"
loader = PyPDFLoader(file_path)
documents = list(loader.lazy_load())


embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store = Chroma.from_documents(documents, embeddings_model)

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")


def retrieve_context(state: QueryState) -> CandidateState:

    candidate_details = state["candidate_state"]

    candidate_context = "Candidate Details : " + "\n".join(f"{key}: {value}" for key, value in candidate_details.items()
                                                           if value is not None and key != "messages" and key != "joining_details")
    joining_context = "Joining Details : " + \
        "\n".join(f"{key}: {value}" for key, value in candidate_details.get(
            "joining_details", {}).items())
    messages_context = "Messages : " + \
        "\n".join(candidate_details.get("messages", []))

    retriever = vector_store.as_retriever()
    docs = retriever.invoke(state["query"])
    docs_context = "\n\n".join(doc.page_content for doc in docs)

    full_context = f"{candidate_context}\n\n{joining_context}\n\n{messages_context}"

    candidate_summary = llm.invoke(
        f"Summarise the joining details of the candidate concisely :\n\n{full_context}")

    policy_summary = llm.invoke(
        f"Summarise the joining details of the candidate concisely :\n\n{docs_context}")
    summary = f"Candidate Details : {candidate_summary.content}\n\nPolicy Details : {policy_summary.content}"
    return {"context": summary}


def decide_next_step(state: CandidateState) -> str:
    # This node decides whether to use LLM or HR intervention based on the quer
    if state.get("use_llm", True):
        return "llm"
    else:
        return "hr"


def respond_to_query(state: QueryState) -> str:
    # This node handles the response to the query using LLM
    prompt = hub.pull("rlm/rag-prompt")
    docs_content = state.get("context", "")

    messages = prompt.invoke(
        {"question": state["query"], "context": docs_content})
    response = llm.invoke(messages)
    print(f"LLM Response: {response.content}")
    return {"answer": response.content}


def create_query_graph() -> StateGraph:

    builder = StateGraph(QueryState)

    builder.add_node(retrieve_context)
    builder.add_node(respond_to_query)

    builder.add_edge(START, "retrieve_context")
    builder.add_conditional_edges("retrieve_context",
                                  decide_next_step,
                                  {"llm": "respond_to_query", "hr": "respond_to_query"})
    builder.add_edge("respond_to_query", END)
    return builder.compile()


_graph_instance = None


def get_query_graph():
    global _graph_instance
    if _graph_instance is None:
        _graph_instance = create_query_graph()
    return _graph_instance
