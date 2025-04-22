import {AgentCard} from "@/a2a/schema";

export class HostState {
    hosts: AgentCard[] = [];

    constructor(init?: Partial<HostState>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
