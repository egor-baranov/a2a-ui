import {useAgentState} from "@/a2a/state/agent/agentStateContext";
import {useSettingsState} from "@/a2a/state/settings/settingsStateContext";

export default function SettingsPage() {

    const { agentState } = useAgentState();
    const {settingsState} = useSettingsState();

    return (
        <div className="p-0">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-muted-foreground">This is the Settings page. Replace with your content.</p>
            <p className="text-muted-foreground">{settingsState.output_mime_types}</p>
        </div>
    );
}
