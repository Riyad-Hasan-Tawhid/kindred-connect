import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Smile } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => Promise<boolean>;
  sending: boolean;
}

const ChatInput = ({ onSend, sending }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim() || sending) return;
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
    <div className="p-3 border-t border-border/50 bg-card/80 backdrop-blur-sm">
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
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
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
          disabled={!message.trim() || sending}
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
  );
};

export default ChatInput;
