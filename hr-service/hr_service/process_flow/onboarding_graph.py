from langgraph.graph import StateGraph, START, END
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import InMemorySaver
from hr_service.process_flow.states import CandidateState
from hr_service.process_flow.nodes import (
    end_onboarding,
    initiate_onboarding,
    request_document,
    validate_bgv,
    validate_document,
    validate_joining_date_confirmation,
    validate_offer_acceptance,
    wait_for_document,
    release_offer,
    wait_for_offer_acceptance,
    initiate_bgv,
    wait_for_bgv_completion,
    confirm_joining_date,
    wait_for_joining_date_confirmation,
    release_appointment_letter,
    reconfirm_joing_date,
    wait_for_reconfirmation_of_joing_date,
    verify_reconfirmation_of_joing_date,
    ready_to_join,
    candidate_joined,
    hr_intervention
)


def create_onboarding_graph() -> StateGraph:

    builder = StateGraph(CandidateState)

    builder.add_node(initiate_onboarding)
    builder.add_node(request_document)
    builder.add_node(wait_for_document)
    builder.add_node(release_offer)
    builder.add_node(wait_for_offer_acceptance)
    builder.add_node(initiate_bgv)
    builder.add_node(wait_for_bgv_completion)
    builder.add_node(confirm_joining_date)
    builder.add_node(wait_for_joining_date_confirmation)
    builder.add_node(release_appointment_letter)
    builder.add_node(reconfirm_joing_date)
    builder.add_node(wait_for_reconfirmation_of_joing_date)
    builder.add_node(ready_to_join)
    builder.add_node(end_onboarding)
    builder.add_node(candidate_joined)

    builder.add_node(hr_intervention)

    builder.add_edge(START, "initiate_onboarding")
    builder.add_edge("initiate_onboarding", "request_document")
    builder.add_edge("request_document", "wait_for_document")
    builder.add_conditional_edges(
        "wait_for_document",
        validate_document,
        {"release_offer": "release_offer", "request_document": "request_document",
            "hr_intervention": "hr_intervention"}
    )

    builder.add_edge("release_offer", "wait_for_offer_acceptance")
    builder.add_conditional_edges(
        "wait_for_offer_acceptance",
        validate_offer_acceptance,
        {"initiate_bgv": "initiate_bgv", "hr_intervention": "hr_intervention"}
    )

    builder.add_edge("initiate_bgv", "wait_for_bgv_completion")
    builder.add_conditional_edges(
        "wait_for_bgv_completion",
        validate_bgv,
        {"confirm_joining_date": "confirm_joining_date",
            "hr_intervention": "hr_intervention"}
    )

    builder.add_edge("confirm_joining_date",
                     "wait_for_joining_date_confirmation")
    builder.add_conditional_edges(
        "wait_for_joining_date_confirmation",
        validate_joining_date_confirmation,
        {"release_appointment_letter": "release_appointment_letter",
            "hr_intervention": "hr_intervention"}
    )

    builder.add_edge("release_appointment_letter", "reconfirm_joing_date")
    builder.add_edge("reconfirm_joing_date",
                     "wait_for_reconfirmation_of_joing_date")
    builder.add_conditional_edges(
        "wait_for_reconfirmation_of_joing_date",
        verify_reconfirmation_of_joing_date,
        {"ready_to_join": "ready_to_join", "hr_intervention": "hr_intervention"}
    )
    
    builder.add_edge("ready_to_join", "hr_intervention")
    builder.add_edge("candidate_joined", "end_onboarding")
    builder.add_edge("end_onboarding", END)

    graph = builder.compile(
        checkpointer=InMemorySaver(), store=InMemoryStore())

    return graph


_graph_instance = None


def get_onboarding_graph():
    global _graph_instance
    if _graph_instance is None:
        _graph_instance = create_onboarding_graph()
    return _graph_instance
