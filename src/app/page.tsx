"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {ArrowUp, LucideSidebar} from "lucide-react";

// Types for agent configuration and chat
interface LlmAgentConfig {
  model: string;
  name: string;
  description: string;
  instruction: string;
  tools: string[];
}

interface Agent {
  id: number;
  llmAgent: LlmAgentConfig;
}

interface ChatMessage {
  id: number;
  sender: "agent" | "user";
  content: string;
}

export default function AgentsPage() {
  // Manage agents list with ability to add new agents.
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 1,
      llmAgent: {
        model: "gemini-2.0-flash-001",
        name: "sde_agent",
        description: "Handles software development tasks.",
        instruction: "Follow the development workflow strictly.",
        tools: ["generate_code", "run_tests", "return_solution"],
      },
    },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "agent",
      content: "Hello, I am your agent. How can I assist you today?",
    },
    {
      id: 2,
      sender: "user",
      content: "I need help setting up a test suite.",
    },
  ]);
  const [newChatMessage, setNewChatMessage] = useState<string>("");
  const [showAgentList, setShowAgentList] = useState(true);
  const [showAgentDetails, setShowAgentDetails] = useState(true);
  const [showNewAgentModal, setShowNewAgentModal] = useState(false);

  // Temporary state to hold new agent form inputs.
  const [newAgentForm, setNewAgentForm] = useState<LlmAgentConfig>({
    model: "",
    name: "",
    description: "",
    instruction: "",
    tools: [],
  });

  // Handler for sending messages in the chat.
  const handleSendMessage = () => {
    if (!newChatMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: chatMessages.length + 1, sender: "user", content: newChatMessage },
    ]);
    setNewChatMessage("");
  };

  // Handler to update agent details in the right sidebar.
  const handleAgentChange = (
      field: keyof LlmAgentConfig,
      value: string | string[]
  ) => {
    setSelectedAgent((prev) => ({
      ...prev,
      llmAgent: {
        ...prev.llmAgent,
        [field]: value,
      },
    }));
  };

  // Handler for creating a new agent from the modal.
  const handleCreateNewAgent = () => {
    // Create new agent object with a new id.
    const newAgent: Agent = {
      id: agents.length + 1,
      llmAgent: {
        ...newAgentForm,
        // Ensure tools is an array if entered as a comma-separated string.
        tools: Array.isArray(newAgentForm.tools)
            ? newAgentForm.tools
            : (newAgentForm.tools as unknown as string).split(",").map((t) => t.trim()),
      },
    };

    // Add the new agent to the agents list.
    setAgents([...agents, newAgent]);
    // Switch to the new agent.
    setSelectedAgent(newAgent);
    // Initialize conversation with a default agent greeting.
    setChatMessages([
      {
        id: 1,
        sender: "agent",
        content: `Hello, I am your new agent "${newAgent.llmAgent.name}". How can I assist you today?`,
      },
    ]);
    // Reset new agent form and close modal.
    setNewAgentForm({
      model: "",
      name: "",
      description: "",
      instruction: "",
      tools: [],
    });
    setShowNewAgentModal(false);
  };

  return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 border-b p-4">
          <h1 className="text-xl font-bold">A2A PDLC Playground</h1>
        </header>

        <main className="flex flex-1">
          {/* Left Sidebar: Agent List */}
          {showAgentList ? (
              <aside className="w-64 border-r p-4 relative flex flex-col">
                {/* Sidebar toggle icon (stays at the top) */}
                <div className="absolute top-2 right-2">
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAgentList(false)}
                  >
                    <LucideSidebar className="w-5 h-5" />
                  </Button>
                </div>
                {/* New Agent Button that opens a modal bubble */}
                <div className="mt-12 mb-6">
                  <Button className="w-full cursor-pointer" onClick={() => setShowNewAgentModal(true)}>
                    + New Agent
                  </Button>
                </div>
                <ul className="flex-1 overflow-y-auto">
                  {agents.map((agent) => (
                      <li
                          key={agent.id}
                          className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                              selectedAgent.id === agent.id ? "bg-gray-300" : ""
                          }`}
                          onClick={() => setSelectedAgent(agent)}
                      >
                        {agent.llmAgent.name}
                      </li>
                  ))}
                </ul>
              </aside>
          ) : (
              <div className="w-8 flex items-start justify-center pt-2 border-r">
                <Button variant="ghost" size="icon" onClick={() => setShowAgentList(true)}>
                  <LucideSidebar className="w-5 h-5" />
                </Button>
              </div>
          )}

          {/* Center Chat Section: Full Width Conversation */}
          <section className="flex-1 flex flex-col p-4 gap-4">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Agent Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3 px-6">
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
              </CardContent>


              <div className="border-t p-4">
                <div className="relative">
                  <Textarea
                      placeholder="Ask anything"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="flex-1 pr-10 pt-5 rounded-2xl shadow-md resize-none"
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
          </section>

          {/* Right Sidebar: Agent Details */}
          {showAgentDetails ? (
              <aside className="w-96 border-l p-4 relative">
                <div className="absolute top-2 left-2">
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAgentDetails(false)}
                  >
                    <LucideSidebar className="w-5 h-5" />
                  </Button>
                </div>
                <h2 className="text-lg font-semibold mt-12 mb-6">Agent Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                        value={selectedAgent.llmAgent.name}
                        onChange={(e) => handleAgentChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model</label>
                    <Input
                        value={selectedAgent.llmAgent.model}
                        onChange={(e) => handleAgentChange("model", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                        value={selectedAgent.llmAgent.description}
                        onChange={(e) =>
                            handleAgentChange("description", e.target.value)
                        }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Instruction
                    </label>
                    <Textarea
                        value={selectedAgent.llmAgent.instruction}
                        onChange={(e) =>
                            handleAgentChange("instruction", e.target.value)
                        }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tools (comma-separated)
                    </label>
                    <Input
                        value={selectedAgent.llmAgent.tools.join(", ")}
                        onChange={(e) =>
                            handleAgentChange(
                                "tools",
                                e.target.value.split(",").map((tool) => tool.trim())
                            )
                        }
                    />
                  </div>
                </div>
              </aside>
          ) : (
              <div className="w-8 flex items-start justify-center pt-2 border-l">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAgentDetails(true)}
                >
                  <LucideSidebar className="w-5 h-5" />
                </Button>
              </div>
          )}
        </main>

        {/* New Agent Modal Overlay */}
        {showNewAgentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h3 className="text-xl font-semibold mb-4">Create New Agent</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                        value={newAgentForm.name}
                        onChange={(e) =>
                            setNewAgentForm({ ...newAgentForm, name: e.target.value })
                        }
                        placeholder="Agent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model</label>
                    <Input
                        value={newAgentForm.model}
                        onChange={(e) =>
                            setNewAgentForm({ ...newAgentForm, model: e.target.value })
                        }
                        placeholder="Model"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                        value={newAgentForm.description}
                        onChange={(e) =>
                            setNewAgentForm({
                              ...newAgentForm,
                              description: e.target.value,
                            })
                        }
                        placeholder="Description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Instruction
                    </label>
                    <Textarea
                        value={newAgentForm.instruction}
                        onChange={(e) =>
                            setNewAgentForm({
                              ...newAgentForm,
                              instruction: e.target.value,
                            })
                        }
                        placeholder="Instruction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tools (comma-separated)
                    </label>
                    <Input
                        value={Array.isArray(newAgentForm.tools) ? newAgentForm.tools.join(", ") : ""}
                        onChange={(e) =>
                            setNewAgentForm({
                              ...newAgentForm,
                              tools: e.target.value.split(",").map((tool) => tool.trim()),
                            })
                        }
                        placeholder="Tool1, Tool2, Tool3"
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
