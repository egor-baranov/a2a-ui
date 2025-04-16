"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,

} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ArrowUp, LucideScroll, LucideSidebar, Scroll, ScrollText} from "lucide-react";
import {AgentCard, Task, TaskQueryParams, TaskSendParams, TextPart} from "@/a2a/schema";
import {A2AClient} from "@/a2a/client";
import {v4 as uuidv4} from "uuid";
import ConversationListPage from "@/app/pages/ConversationListPage";
import AgentListPage from "@/app/pages/AgentListPage";
import EventListPage from "@/app/pages/EventList";
import TaskListPage from "@/app/pages/TaskListPage";
import SettingsPage from "@/app/pages/SettingsPage";
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatMessage {
    id: number;
    sender: "agent" | "user";
    content: string;
}

export default function HomePage() {
    // Initialize with one default agent (using the sample JSON provided).
    const [agents, setAgents] = useState<AgentCard[]>([]);

    const [activeTab, setActiveTab] = useState<"chat" | "chats" | "agents" | "events" | "tasks" | "settings">("chats");

    const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(agents[0]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "agent",
            content: "Hello, I am your agent. How can I assist you today?",
        }
    ]);
    const [newChatMessage, setNewChatMessage] = useState<string>("");
    const [showAgentList, setShowAgentList] = useState(true);
    const [showAgentDetails, setShowAgentDetails] = useState(true);
    const [showNewAgentModal, setShowNewAgentModal] = useState(false);

    // Instead of a form with multiple fields, we now accept only a URL.
    const [newAgentUrl, setNewAgentUrl] = useState<string>("");

    // Handler for sending messages in the chat.
    const handleSendMessage = async () => {
        if (!newChatMessage.trim()) return;
        // (You may also want to call your A2AClient sendTask here)
        setChatMessages([
            ...chatMessages,
            {id: chatMessages.length + 1, sender: "user", content: newChatMessage},
        ]);
        setNewChatMessage("");

        const client = new A2AClient(selectedAgent!!.url, window.fetch.bind(window));
        try {
            // Send a simple task (pass only params)
            const taskId = uuidv4();
            const sendParams: TaskSendParams = {
                id: taskId,
                message: {role: "user", parts: [{text: newChatMessage, type: "text"}]},
            };
            // Method now returns Task | null directly
            const taskResult: Task | null = await client.sendTask(sendParams);
            console.log("Send Task Result:", taskResult);

            // Get task status (pass only params)
            const getParams: TaskQueryParams = {id: taskId};
            // Method now returns Task | null directly
            const getTaskResult: Task | null = await client.getTask(getParams);
            console.log("Get Task Result:", getTaskResult);

            setChatMessages([
                ...chatMessages,
                {id: chatMessages.length + 1, sender: "user", content: newChatMessage},
                {
                    id: chatMessages.length + 2,
                    sender: "agent",
                    content: taskResult?.status.message?.parts.map(v => (v as TextPart).text).join("") ?? "Response is null"
                },
            ]);
        } catch (error) {
            console.error("A2A Client Error:", error);
        }
    };

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
            setSelectedAgent(newAgent);

            // Add a default greeting message
            setChatMessages([
                {
                    id: 1,
                    sender: "agent",
                    content: `Hello, I am your new agent "${newAgent.name}". How can I assist you today?`,
                },
            ]);

            // Reset new agent URL and close the modal
            setNewAgentUrl("");
            setShowNewAgentModal(false);
        } catch (error) {
            console.error("Error fetching agent data:", error);
            alert(`Failed to fetch agent. Check the URL and try again: ${error}.`);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}

            <header className="bg-white border-b p-4 flex items-center justify-between">
                <h1 className="pl-12 text-xl font-bold">A2A UI</h1>

                <nav className="space-x-8 pr-16">
                    <Button
                        variant={activeTab === "chats" || activeTab == "chat" ? "default" : "ghost"}
                        className="text-md cursor-pointer"
                        onClick={() => setActiveTab("chats")}
                    >
                        Conversations
                    </Button>
                    <Button
                        variant={activeTab === "agents" ? "default" : "ghost"}
                        className="text-md cursor-pointer"
                        onClick={() => setActiveTab("agents")}
                    >
                        Agents
                    </Button>
                    <Button
                        variant={activeTab === "events" ? "default" : "ghost"}
                        className="text-md cursor-pointer"
                        onClick={() => setActiveTab("events")}
                    >
                        Event List
                    </Button>
                    <Button
                        variant={activeTab === "tasks" ? "default" : "ghost"}
                        className="text-md cursor-pointer"
                        onClick={() => setActiveTab("tasks")}
                    >
                        Task List
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="text-md cursor-pointer"
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </Button>
                </nav>
            </header>

            {activeTab == "chat" && (<main className="flex flex-1">
                {/* Left Sidebar: Agent List */}
                {showAgentList ? (
                    <aside className="w-64 border-r p-4 relative flex flex-col">
                        {/* Sidebar toggle icon (pinned to top) */}
                        <div className="absolute top-2 right-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAgentList(false)}
                            >
                                <LucideSidebar className="w-5 h-5"/>
                            </Button>
                        </div>
                        <h2 className="text-lg font-semibold mt-8 mb-4 px-2">Remote Agents</h2>
                        {/* New Agent Button appears below icon */}
                        <div className="mt-4 mb-6">
                            <Button
                                className="w-full cursor-pointer"
                                onClick={() => setShowNewAgentModal(true)}
                            >
                                Add Agent
                            </Button>
                        </div>
                        <ul className="flex-1 overflow-y-auto">
                            {agents.map((agent, index) => (
                                <li
                                    key={index}
                                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                                        selectedAgent?.name === agent.name ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() => setSelectedAgent(agent)}
                                >
                                    {agent.name}
                                </li>
                            ))}
                        </ul>
                    </aside>
                ) : (
                    <div className="w-12 cursor-pointer flex items-start justify-center pt-2 border-r">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowAgentList(true)}
                        >
                            <LucideSidebar className="w-5 h-5"/>
                        </Button>
                    </div>
                )}

                {selectedAgent != null && (<section className="flex flex-col w-full h-full p-4 gap-4">
                    <Card className="flex flex-col w-full h-full">
                        {/* Message container that occupies full space and hides overflow */}
                        <CardContent className="flex-1 overflow-hidden w-full">
                            <ScrollArea className="w-full h-[620px]">
                                {chatMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-3 text-sm whitespace-pre-wrap break-words px-4 ${
                                            message.sender === "user"
                                                ? "bg-gray-100 rounded-xl ml-auto text-left max-w-[50%] w-fit"
                                                : "bg-white rounded-md self-start text-left w-full"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                        {/* Input area remains fixed at the bottom */}
                        <div className="border-t px-6 pt-6 w-full">
                            <div className="relative">
                                <Textarea
                                    placeholder="Ask anything"
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    className="w-full pr-10 pt-5 px-4 pb-4 rounded-2xl shadow-md resize-none"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>)}


                {/* Right Sidebar: Agent Details */}
                {showAgentDetails && selectedAgent ? (
                    <aside className="w-96 border-l relative flex flex-col h-full">
                        <div className="absolute top-2 left-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAgentDetails(false)}
                            >
                                <LucideSidebar className="w-5 h-5"/>
                            </Button>
                        </div>
                        <h2 className="text-lg font-semibold mt-12 mb-6 px-4">Agent Details</h2>
                        {/* The scrollable container */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <Input
                                    value={selectedAgent.name}
                                    onChange={(e) =>
                                        setSelectedAgent({...selectedAgent, name: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Textarea
                                    value={selectedAgent.description ?? ""}
                                    onChange={(e) =>
                                        setSelectedAgent({
                                            ...selectedAgent,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <Input
                                    value={selectedAgent.url}
                                    onChange={(e) =>
                                        setSelectedAgent({...selectedAgent, url: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Skills</label>
                                <Textarea
                                    value={selectedAgent.skills
                                        .map(
                                            (s) =>
                                                `${s.name}: ${s.description} (${s.tags!.join(", ")})`
                                        )
                                        .join("\n")}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Version</label>
                                <Input
                                    value={selectedAgent.version}
                                    onChange={(e) =>
                                        setSelectedAgent({...selectedAgent, version: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Capabilities (streaming, pushNotifications, stateTransitionHistory)
                                </label>
                                <Input
                                    value={`streaming: ${selectedAgent.capabilities.streaming}, pushNotifications: ${selectedAgent.capabilities.pushNotifications}, stateTransitionHistory: ${selectedAgent.capabilities.stateTransitionHistory}`}
                                    disabled
                                />
                            </div>
                        </div>
                    </aside>
                ) : (
                    <div className="w-12 cursor-pointer flex items-start justify-center pt-2 border-l">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowAgentDetails(true)}
                        >
                            <LucideSidebar className="w-5 h-5"/>
                        </Button>
                    </div>
                )}

            </main>)}

            <main className="flex-grow overflow-auto px-16 pt-8">
                {activeTab == "chats" && <ConversationListPage/>}
                {activeTab == "agents" && <AgentListPage/>}
                {activeTab == "events" && <EventListPage/>}
                {activeTab == "tasks" && <TaskListPage/>}
                {activeTab == "settings" && <SettingsPage/>}
                {activeTab == "chats" && <Button
                    variant={"default"}
                    className="text-md cursor-pointer"
                    onClick={() => setActiveTab("chat")}
                >
                    Open Chat
                </Button>}
            </main>

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
    );
}
