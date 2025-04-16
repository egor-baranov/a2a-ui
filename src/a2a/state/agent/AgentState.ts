export class AgentState {
    agent_dialog_open: boolean = false;
    agent_address: string = "";
    agent_name: string = "";
    agent_description: string = "";
    input_modes: string[] = [];
    output_modes: string[] = [];
    stream_supported: boolean = false;
    push_notifications_supported: boolean = false;
    error: string = "";
    agent_framework_type: string = "";

    constructor(init?: Partial<AgentState>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
