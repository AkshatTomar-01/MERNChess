import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessageWithUser } from "@shared/schema";

interface ChatPanelProps {
  gameId: string;
}

export default function ChatPanel({ gameId }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  const { data: messages = [] } = useQuery<ChatMessageWithUser[]>({
    queryKey: [`/api/game/chat/${gameId}`],
    refetchInterval: 2000,
    staleTime: 0,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return await apiRequest("POST", "/api/game/chat", {
        gameId,
        message: messageText,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/game/chat/${gameId}`] });
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col">
        <div className="h-[320px] overflow-y-auto p-4 space-y-2 bg-muted/20">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Say hi!
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.userId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                >
                  {!isOwn && (
                    <span className="text-xs text-muted-foreground mb-1 ml-1">
                      {msg.user.username}
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card text-foreground rounded-bl-sm border"
                    }`}
                  >
                    <p className="text-sm break-words leading-relaxed">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/70 text-right" : "text-muted-foreground"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
              className="rounded-full"
              data-testid="input-chat-message"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="rounded-full shrink-0"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
