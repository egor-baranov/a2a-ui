import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card"
import {useAgentState} from "@/a2a/state/agent/agentStateContext";
import {useAppState} from "@/a2a/state/app/appStateContext";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {StateConversation} from "@/a2a/state";
import {ExternalLink, LucideSidebar, Pencil, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {A2AClient} from "@/a2a/client";
import {AgentCard} from "@/a2a/schema";
import {useHostState} from "@/a2a/state/host/hostStateContext";

type Props = {
    openConversation: (conversation: StateConversation) => void;
};
export default function AgentListPage() {

    // Initialize with one default agent (using the sample JSON provided).
    const [agents, setAgents] = useState<AgentCard[]>([]);
    const [showAgentList, setShowAgentList] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(agents[0]);

    const [hostState, setHostState] = useHostState();
    const [showNewAgentModal, setShowNewAgentModal] = useState(false);

    // Instead of a form with multiple fields, we now accept only a URL.
    const [newAgentUrl, setNewAgentUrl] = useState<string>("");

    // Handler for creating a new agent from the modal.
    const handleCreateNewAgent = async () => {
        const rawUrl = newAgentUrl.trim();
        if (!rawUrl) return;

        try {
            // Assuming AgentCard is a TypeScript type for your agent data
            const newAgent: AgentCard = await new A2AClient(
                newAgentUrl,
                window.fetch.bind(window)
            ).agentCard();

            // Update state with the new agent
            setAgents((prev) => [...prev, newAgent]);
            hostState.agents = [...hostState.agents, newAgent];
            setHostState(hostState);
            setSelectedAgent(newAgent);

            // Reset new agent URL and close the modal
            setNewAgentUrl("");
            setShowNewAgentModal(false);
        } catch (error) {
            console.error("Error fetching agent data:", error);
            alert(`Failed to fetch agent. Check the URL and try again: ${error}.`);
        }
    };

    return (
        <div className="pb-4">
            <div className="flex items-center justify-between mb-8">
                {/* Left block: heading + description */}
                <div>
                    <h2 className="text-2xl font-semibold">Agents</h2>
                    <p className="text-muted-foreground">
                        This is the page where you can manage agents and their workflows.
                    </p>
                </div>
                {/* Right-aligned “Add” button */}
                <Button
                    variant={"default"}
                    className="text-md cursor-pointer"
                    onClick={
                        () => {
                            setShowNewAgentModal(true)
                        }
                    }
                >
                    Add
                </Button>
            </div>
            <div className="space-y-4">
                {agents.map((agent, index) => (
                    <Card key={agent.url} className="py-3 px-6">

                        <CardContent className="p-0 flex justify-between items-center text-sm">
                            <div>
                                <div className="font-medium text-lg">{agent.name}</div>
                                <div className="text-md text-muted-foreground">ID: {agent.url}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-md">
                                    {agent.skills.length > 0 ? "Active" : "Inactive"}
                                </Badge>
                                <div className="text-md text-muted-foreground">{agent.skills.length} messages</div>

                                {/* Buttons */}
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 ml-8 cursor-pointer">
                                    <Trash2 className="w-4 h-4 text-red-600"/>
                                </Button>
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 cursor-pointer">
                                    <Pencil className="w-4 h-4 text-gray-700"/>
                                </Button>
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 cursor-pointer" onClick={() => {

                                }}>
                                    <ExternalLink className="w-4 h-4 text-gray-700"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Agent Modal Overlay (Paste URL and fetch JSON to create new agent) */}
            {showNewAgentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4">Create New Agent</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Agent URL
                                </label>
                                <Input
                                    value={newAgentUrl}
                                    onChange={(e) => setNewAgentUrl(e.target.value)}
                                    placeholder="http://localhost:10004"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowNewAgentModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateNewAgent}>Create Agent</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
