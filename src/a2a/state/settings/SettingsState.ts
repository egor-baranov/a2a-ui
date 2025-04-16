// SettingsState: Settings State.
export class SettingsState {
    output_mime_types: string[] = ["image/*", "text/plain"];

    constructor(output_mime_types?: string[]) {
        if (output_mime_types) {
            this.output_mime_types = output_mime_types;
        }
    }
}
