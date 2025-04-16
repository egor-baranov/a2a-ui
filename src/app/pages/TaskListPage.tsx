import {useAgentState} from "@/a2a/state/agent/agentStateContext";

export default function TaskListPage() {

    const { agentState } = useAgentState();

    return (
        <div className="p-0">
            <h2 className="text-2xl font-semibold mb-4">Task List</h2>
            <p className="text-muted-foreground">This is the Task List page. Replace with your content.</p>
        </div>
    );
}
