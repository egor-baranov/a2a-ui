"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {AppState} from "@/a2a/state/app/AppState";

// Define the shape of the context
interface AppStateContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

// Create the context with a default value of undefined.
// You will validate that the context is defined in the hook.
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
    // Create the AppState using React's useState hook.
    const [appState, setAppState] = useState<AppState>(new AppState());

    return (
        <AppStateContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppStateContext.Provider>
    );
};

// Custom hook for consuming the context.
export const useAppState = (): AppStateContextType => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppState must be used within an AppStateProvider");
    }
    return context;
};
