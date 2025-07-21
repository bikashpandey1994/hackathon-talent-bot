from typing import List

from hr_service.process_flow.states import GraphState
from . import onboarding_graph
from langgraph.types import interrupt, Command


def init(request) -> str:

    graph = onboarding_graph.get_onboarding_graph()
    config = {"configurable": {"thread_id": request["thread_id"]}}

    candidate_state = {
        "thread_id": request["thread_id"],
        "name": request["name"],
        "email": request["email"],
        "mobile_no": request["mobile_no"],
        "status": request.get("status"),
        "state": request.get("state"),
        "messages": [],
        "joining_details": request.get("joining_details", {})
    }
    response = graph.invoke(candidate_state, config)

    return response


def resume(request) -> str:

    config = {"configurable": {
        "thread_id": request["thread_id"]
    }
    }
    graph = onboarding_graph.get_onboarding_graph()
    state = graph.get_state(config)

    candidate_state = {
        "state": request.get("state"),
        "messages": request.get("messages", []),
        "docs": request.get("docs", []),
    }

    if state:
        response = graph.invoke(Command(resume=candidate_state), config)
    else:
        response = "State doesn't exists, can't resume."

    return response


def perform_action(request) -> str:

    config = {"configurable": {
        "thread_id": request.get("thread_id"),
        "checkpoint_id": request.get("candidate_checkpoint_id", "")
    }
    }
    
    candidate_state = {
        "hr_message": request.get("hr_message"),
        "hr_nextnode": request.get("hr_nextnode")
    }
        
    graph = onboarding_graph.get_onboarding_graph()
    response = graph.invoke(Command(resume=candidate_state), config)

    return response


def get_state(candidate_state) -> GraphState:

    graph = onboarding_graph.get_onboarding_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    state = graph.get_state(config)

    if state:
        graph_state = GraphState(
            values=state.values,
            next=state.next[0] if state.next else None,
            config=state.config,
            metadata=state.metadata,
            created_at=state.created_at,
            parent_config=state.parent_config,
            tasks=state.tasks,
            interrupts=state.interrupts
        )
        return graph_state
    else:
        return None


def history(candidate_state) -> List[GraphState]:

    graph = onboarding_graph.get_onboarding_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    states = list(graph.get_state_history(config))

    if graph_states:
        graph_states = [GraphState(
            candidate_state=state.values,
            next_node=state.next[0],
            thread_id=state.config['configurable']["thread_id"],
            checkpoint_id=state.config['configurable']["checkpoint_id"],
            created_at=state.created_at,
            # interrupts=state.interrupts
        ) for state in states]
        return graph_states
    else:
        graph_states = []

    return graph_states
