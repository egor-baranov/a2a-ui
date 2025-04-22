import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card"
import {useAgentState} from "@/a2a/state/agent/agentStateContext";
import {useAppState} from "@/a2a/state/app/appStateContext";
import {Button} from "@/components/ui/button";
import React from "react";
import {v4 as uuidv4} from "uuid";
import {StateConversation} from "@/a2a/state";
import {ExternalLink, Pencil, Trash2} from "lucide-react";

type Props = {
    openConversation: (conversation: StateConversation) => void;
};
export default function ConversationListPage({openConversation}: Props) {

    const {agentState, setAgentState} = useAgentState();
    const {appState, setAppState} = useAppState();

    return (
        <div className="pb-4">
            <div className="flex items-center justify-between mb-8">
                {/* Left block: heading + description */}
                <div>
                    <h2 className="text-2xl font-semibold">Conversations</h2>
                    <p className="text-muted-foreground">
                        This is the page where you can manage conversations to communicate with your connected agents.
                    </p>
                </div>
                {/* Right-aligned “Add” button */}
                <Button
                    variant={"default"}
                    className="text-md cursor-pointer"
                    onClick={
                        () => {
                            const newConversation = {
                                conversation_id: uuidv4(),
                                conversation_name: "New conversation",
                                is_active: true,
                                message_ids: [],
                            };

                            // 1) Create a new conversations array
                            const updatedConversations = [
                                ...appState.conversations,
                                newConversation,
                            ];

                            // 2) Set a new state object
                            setAppState({
                                ...appState,
                                conversations: updatedConversations,
                            });
                        }
                    }
                >
                    Add
                </Button>
            </div>
            <div className="space-y-4">
                {appState.conversations.map(chat => (
                    <Card key={chat.conversation_id} className="py-3 px-6">

                        <CardContent className="p-0 flex justify-between items-center text-sm">
                            <div>
                                <div className="font-medium text-lg">{chat.conversation_name}</div>
                                <div className="text-md text-muted-foreground">ID: {chat.conversation_id}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-md">
                                    {chat.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <div className="text-md text-muted-foreground">{chat.message_ids.length} messages</div>

                                {/* Buttons */}
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 ml-8 cursor-pointer">
                                    <Trash2 className="w-4 h-4 text-red-600"/>
                                </Button>
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 cursor-pointer">
                                    <Pencil className="w-4 h-4 text-gray-700"/>
                                </Button>
                                <Button variant="ghost" size="icon"
                                        className="bg-white border hover:bg-gray-100 cursor-pointer" onClick={() => {
                                    openConversation(
                                        appState.conversations.find(
                                            it => it.conversation_id == chat.conversation_id
                                        )!
                                    );
                                }}>
                                    <ExternalLink className="w-4 h-4 text-gray-700"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
