// Define a type that can either be a string or an object with arbitrary keys.
export type ContentPart = string | { [key: string]: any };

// ---------------------------------------------------------------------------
// StateConversation: Provides a state compliant view of a conversation.
export class StateConversation {
    conversation_id: string;
    conversation_name: string;
    is_active: boolean;
    message_ids: string[];

    constructor(
        conversation_id: string = "",
        conversation_name: string = "",
        is_active: boolean = true,
        message_ids: string[] = []
    ) {
        this.conversation_id = conversation_id;
        this.conversation_name = conversation_name;
        this.is_active = is_active;
        this.message_ids = message_ids;
    }
}

// ---------------------------------------------------------------------------
// StateMessage: Provides a state compliant view of a message.
export class StateMessage {
    message_id: string;
    role: string;
    // Each entry is a pair of [content, mediaType].
    content: [ContentPart, string][];

    constructor(
        message_id: string = "",
        role: string = "",
        content: [ContentPart, string][] = []
    ) {
        this.message_id = message_id;
        this.role = role;
        this.content = content;
    }
}

// ---------------------------------------------------------------------------
// StateTask: Provides a state compliant view of a task.
export class StateTask {
    task_id: string;
    session_id: string | null;
    state: string | null;
    message: StateMessage;
    // Each element of artifacts is a list of [content, mediaType] pairs.
    artifacts: [ContentPart, string][][];

    constructor(
        task_id: string = "",
        session_id: string | null = null,
        state: string | null = null,
        message: StateMessage = new StateMessage(),
        artifacts: [ContentPart, string][][] = []
    ) {
        this.task_id = task_id;
        this.session_id = session_id;
        this.state = state;
        this.message = message;
        this.artifacts = artifacts;
    }
}

// ---------------------------------------------------------------------------
// SessionTask: Organizes tasks based on conversation.
export class SessionTask {
    session_id: string;
    task: StateTask;

    constructor(session_id: string = "", task: StateTask = new StateTask()) {
        this.session_id = session_id;
        this.task = task;
    }
}

// ---------------------------------------------------------------------------
// StateEvent: Provides a state compliant view of an event.
export class StateEvent {
    conversation_id: string;
    actor: string;
    role: string;
    id: string;
    // Each entry is a pair of [content, mediaType].
    content: [ContentPart, string][];

    constructor(
        conversation_id: string = "",
        actor: string = "",
        role: string = "",
        id: string = "",
        content: [ContentPart, string][] = []
    ) {
        this.conversation_id = conversation_id;
        this.actor = actor;
        this.role = role;
        this.id = id;
        this.content = content;
    }
}