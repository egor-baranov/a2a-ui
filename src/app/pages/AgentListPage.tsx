import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {useAgentState} from "@/a2a/state/agent/agentStateContext";

export default function AgentListPage() {
    const chats = [
        { ID: "001", Name: "Support Chat", Status: "Active", Messages: 23 },
        { ID: "002", Name: "Team Sync", Status: "Archived", Messages: 10 },
        { ID: "003", Name: "User Feedback", Status: "Pending", Messages: 5 },
        { ID: "004", Name: "QA Session", Status: "Active", Messages: 18 },
        { ID: "005", Name: "Bug Reports", Status: "Closed", Messages: 42 },
    ]

    const { agentState } = useAgentState();

    return (
        <div className="pb-4">
            <h2 className="text-2xl font-semibold mb-4">Chats</h2>
            <p className="text-muted-foreground mb-8">This is the Agents page. Replace with your content.</p>
            <div className="space-y-4">
                {chats.map(chat => (
                    <Card key={chat.ID} className="py-3 px-6 cursor-pointer">
                        <CardContent className="p-0 flex justify-between items-center text-sm">
                            <div>
                                <div className="font-medium text-lg">{chat.Name}</div>
                                <div className="text-md text-muted-foreground">ID: {chat.ID}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-md">{chat.Status}</Badge>
                                <div className="text-md text-muted-foreground">{chat.Messages} msgs</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
