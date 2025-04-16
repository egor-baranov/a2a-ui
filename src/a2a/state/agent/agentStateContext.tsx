"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {AgentState} from "@/a2a/state/agent/AgentState";

// Define the shape of the context
interface AgentStateContextType {
    agentState: AgentState;
    setAgentState: React.Dispatch<React.SetStateAction<AgentState>>;
}

// Create the context with a default value of undefined.
// You will validate that the context is defined in the hook.
const AgentStateContext = createContext<AgentStateContextType | undefined>(undefined);

export const AgentStateProvider = ({ children }: { children: ReactNode }) => {
    // Create the AgentState using React's useState hook.
    const [agentState, setAgentState] = useState<AgentState>(new AgentState());

    return (
        <AgentStateContext.Provider value={{ agentState, setAgentState }}>
            {children}
        </AgentStateContext.Provider>
    );
};

// Custom hook for consuming the context.
export const useAgentState = (): AgentStateContextType => {
    const context = useContext(AgentStateContext);
    if (!context) {
        throw new Error("useAgentState must be used within an AgentStateProvider");
    }
    return context;
};
