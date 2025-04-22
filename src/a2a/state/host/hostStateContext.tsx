"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {HostState} from "@/a2a/state/host/HostState";

// Define the shape of the context
interface HostStateContextType {
    hostState: HostState;
    setHostState: React.Dispatch<React.SetStateAction<HostState>>;
}

// Create the context with a default value of undefined.
// You will validate that the context is defined in the hook.
const HostStateContext = createContext<HostStateContextType | undefined>(undefined);

export const HostStateProvider = ({ children }: { children: ReactNode }) => {
    // Create the HostState using React's useState hook.
    const [hostState, setHostState] = useState<HostState>(new HostState());

    return (
        <HostStateContext.Provider value={{ hostState, setHostState }}>
            {children}
        </HostStateContext.Provider>
    );
};

// Custom hook for consuming the context.
export const useHostState = (): HostStateContextType => {
    const context = useContext(HostStateContext);
    if (!context) {
        throw new Error("useHostState must be used within an HostStateProvider");
    }
    return context;
};
