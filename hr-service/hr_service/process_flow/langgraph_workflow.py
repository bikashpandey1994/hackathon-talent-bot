from . import hr_graph
from langgraph.types import interrupt, Command

def init(candidate_state) -> str:

    graph = hr_graph.get_hr_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    response = graph.invoke(candidate_state, config)

    return response

def resume(candidate_state) -> str:

    graph = hr_graph.get_hr_graph()
    config = {"configurable": {"thread_id": candidate_state["thread_id"]}}
    state = graph.get_state(config)

    if state.interrupts:
        response = graph.invoke(Command(resume=candidate_state), config)
    else:
        response = "State doesn't exists, can't resume."

    return response
