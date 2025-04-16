// AppState: Application State.
// If you have a decorator or special handling similar to @me.stateclass,
// you may create a custom decorator or simply note it in comments.
import {SessionTask, StateConversation, StateMessage} from "@/a2a/state";

export class AppState {
    sidenav_open: boolean = false;
    theme_mode: "system" | "light" | "dark" = "system";

    current_conversation_id: string = "";
    conversations: StateConversation[] = [];
    messages: StateMessage[] = [];
    task_list: SessionTask[] = [];
    background_tasks: { [key: string]: string } = {};
    message_aliases: { [key: string]: string } = {};
    // Used to track data entered in a form.
    completed_forms: { [key: string]: { [key: string]: any } | null } = {};
    // Used to track the message sent to agent with form data.
    form_responses: { [key: string]: string } = {};
    polling_interval: number = 1;

    constructor(init?: Partial<AppState>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
