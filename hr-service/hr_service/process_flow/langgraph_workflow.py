from typing import List

from hr_service.process_flow.states import GraphState
from . import hr_graph
from langgraph.types import interrupt, Command


def init(candidate_state) -> str:

    graph = hr_graph.get_hr_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    response = graph.invoke(candidate_state, config)

    return response


def resume(candidate_state) -> str:

    config = {"configurable": {
        "thread_id": candidate_state["thread_id"],
        "checkpoint_id": candidate_state["candidate_checkpoint_id"]
    }
    }
    graph = hr_graph.get_hr_graph()
    state = graph.get_state(config)
    if state:
        response = graph.invoke(Command(resume=candidate_state), config)
    else:
        response = "State doesn't exists, can't resume."

    return response


def history(candidate_state) -> List[GraphState]:

    graph = hr_graph.get_hr_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    states = list(graph.get_state_history(config))

    graph_states = [GraphState(
        candidate_state=state.values,
        next_node=state.next[0],
        thread_id=state.config['configurable']["thread_id"],
        checkpoint_id=state.config['configurable']["checkpoint_id"],
        created_at=state.created_at,
        # interrupts=state.interrupts
    ) for state in states]

    return graph_states
