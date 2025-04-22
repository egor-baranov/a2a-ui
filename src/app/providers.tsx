"use client"

import React, {ReactNode} from "react"
import {SettingsStateProvider} from "@/a2a/state/settings/settingsStateContext";
import {AgentStateProvider} from "@/a2a/state/agent/agentStateContext";
import {AppStateProvider} from "@/a2a/state/app/appStateContext";
import {HostStateProvider} from "@/a2a/state/host/hostStateContext";

export function Providers({children}: { children: ReactNode }) {
    return (
        <AppStateProvider>
            <SettingsStateProvider>
                <AgentStateProvider>
                    <HostStateProvider>
                        {children}
                    </HostStateProvider>
                </AgentStateProvider>
            </SettingsStateProvider>
        </AppStateProvider>
    )
}
