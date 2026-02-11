import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Smile, Crown, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatInputProps {
  onSend: (content: string) => Promise<boolean>;
  sending: boolean;
  messageCount?: number;
  isPremium?: boolean;
}

const FREE_MESSAGE_LIMIT = 50;

const ChatInput = ({ onSend, sending, messageCount = 0, isPremium = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const limitReached = !isPremium && messageCount >= FREE_MESSAGE_LIMIT;
  const remaining = FREE_MESSAGE_LIMIT - messageCount;

  const handleSend = async () => {
    if (!message.trim() || sending || limitReached) return;
    const success = await onSend(message);
    if (success) setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm">
      {/* Message limit warning */}
      {!isPremium && messageCount >= 40 && (
        <div className={`px-4 py-2 flex items-center gap-2 text-xs ${
          limitReached
            ? "bg-destructive/10 text-destructive"
            : "bg-accent text-accent-foreground"
        }`}>
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">
            {limitReached
              ? "You've reached your free message limit (50). Upgrade to continue chatting."
              : `${remaining} free messages remaining in this conversation.`}
          </span>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 font-semibold hover:underline shrink-0"
          >
            <Crown className="h-3 w-3" />
            Upgrade
          </button>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground shrink-0 self-end"
          >
            <Smile className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <textarea
              placeholder={limitReached ? "Message limit reached" : "Type a message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending || limitReached}
              rows={1}
              className="w-full resize-none rounded-xl border border-input bg-muted/40 px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 max-h-32 overflow-y-auto"
              style={{ minHeight: "40px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "40px";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || sending || limitReached}
            className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground shadow-soft hover:shadow-hover transition-all duration-200 shrink-0 self-end disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
