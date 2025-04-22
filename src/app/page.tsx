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
import {ScrollArea} from "@/components/ui/scroll-area"
import {StateConversation} from "@/a2a/state";
import {useHostState} from "@/a2a/state/host/hostStateContext";

interface ChatMessage {
    id: number;
    sender: "agent" | "user";
    content: string;
}

export default function HomePage() {
    // Initialize with one default agent (using the sample JSON provided).
    const [agents, setAgents] = useState<AgentCard[]>([]);

    const [activeTab, setActiveTab] = useState<"chat" | "chats" | "agents" | "events" | "tasks" | "settings">("chats");

    const [hostState, setHostState] = useHostState();

    const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(agents[0]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "agent",
            content: "Hello, I am your agent. How can I assist you today?",
        }
    ]);

    const [conversation, setConversation] = useState<StateConversation | null>(null);

    const [newChatMessage, setNewChatMessage] = useState<string>("");
    const [showAgentDetails, setShowAgentDetails] = useState(true);

    // Handler for sending messages in the chat.
    const handleSendMessage = async () => {
        if (!newChatMessage.trim()) return;
        // (You may also want to call your A2AClient sendTask here)
        setChatMessages([
            ...chatMessages,
            {id: chatMessages.length + 1, sender: "user", content: newChatMessage},
        ]);
        setNewChatMessage("");

        const client = new A2AClient(hostState.agents.first!!.url, window.fetch.bind(window));
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
                {(<section className="flex flex-col w-full h-full p-4 gap-4">
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
                                    className="w-full pr-10 pt-5 px-4 pb-4 rounded-2xl shadow-md resize-none focus-visible:ring-0 min-h-auto overflow-auto max-h-80 resize-none"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
                                >
                                    <ArrowUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>)}


                {/* Right Sidebar: Agent Details */}
                {showAgentDetails && hostState.agents.first ? (
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
                                    value={hostState.agents.first}
                                    onChange={(e) =>
                                        setSelectedAgent({...hostState.agents.first, name: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Textarea
                                    value={hostState.agents.first.description ?? ""}
                                    onChange={(e) =>
                                        setSelectedAgent({
                                            ...hostState.agents.first,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <Input
                                    value={hostState.agents.first.url}
                                    onChange={(e) =>
                                        setSelectedAgent({...hostState.agents.first, url: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Skills</label>
                                <Textarea
                                    value={hostState.agents.first.skills
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
                                    value={hostState.agents.first.version}
                                    onChange={(e) =>
                                        setSelectedAgent({...hostState.agents.first, version: e.target.value})
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Capabilities (streaming, pushNotifications, stateTransitionHistory)
                                </label>
                                <Input
                                    value={`streaming: ${hostState.agents.first.capabilities.streaming}, pushNotifications: ${hostState.agents.first.capabilities.pushNotifications}, stateTransitionHistory: ${hostState.agents.first.capabilities.stateTransitionHistory}`}
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
                {activeTab == "chats" && <ConversationListPage openConversation={
                    (conversation) => {
                        setConversation(conversation);
                        setActiveTab("chat");
                    }
                }/>}
                {activeTab == "agents" && <AgentListPage/>}
                {activeTab == "events" && <EventListPage/>}
                {activeTab == "tasks" && <TaskListPage/>}
                {activeTab == "settings" && <SettingsPage/>}
            </main>
        </div>
    );
}
