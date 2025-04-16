"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {SettingsState} from "@/a2a/state/settings/SettingsState";

// Define the shape of the context
interface SettingStateContextType {
    settingsState: SettingsState;
    setSettingsState: React.Dispatch<React.SetStateAction<SettingsState>>;
}

// Create the context with a default value of undefined.
// You will validate that the context is defined in the hook.
const SettingsStateContext = createContext<SettingStateContextType | undefined>(undefined);

export const SettingsStateProvider = ({ children }: { children: ReactNode }) => {
    // Create the SettingsState using React's useState hook.
    const [settingsState, setSettingsState] = useState<SettingsState>(new SettingsState());

    return (
        <SettingsStateContext.Provider value={{ settingsState, setSettingsState }}>
            {children}
        </SettingsStateContext.Provider>
    );
};

// Custom hook for consuming the context.
export const useSettingsState = (): SettingStateContextType => {
    const context = useContext(SettingsStateContext);
    if (!context) {
        throw new Error("useSettingsState must be used within an SettingsStateProvider");
    }
    return context;
};
