import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSkeleton } from "@/components/matches/MatchSkeletons";
import { Message } from "@/hooks/useMessages";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  userId: string;
  partnerName: string;
}

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "h:mm a");
};

const formatDateSeparator = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

const ChatMessages = ({ messages, loading, userId, partnerName }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <MessageSkeleton sent={false} />
        <MessageSkeleton sent={true} />
        <MessageSkeleton sent={false} />
        <MessageSkeleton sent={true} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <p className="font-medium text-foreground mb-1">
            Start your conversation
          </p>
          <p className="text-sm text-muted-foreground">
            Say hello to {partnerName}! Don't be shy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isSent = msg.sender_id === userId;
            const showDate =
              index === 0 ||
              !isSameDay(new Date(msg.created_at), new Date(messages[index - 1].created_at));

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-[11px] text-muted-foreground bg-muted/80 px-3 py-1 rounded-full font-medium">
                      {formatDateSeparator(msg.created_at)}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 ${
                      isSent
                        ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-md"
                        : "bg-card border border-border/50 text-foreground rounded-2xl rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isSent ? "justify-end" : ""}`}>
                      <span
                        className={`text-[10px] ${
                          isSent ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {formatMessageTime(msg.created_at)}
                      </span>
                      {isSent && (
                        msg.is_read
                          ? <CheckCheck className="h-3 w-3 text-primary-foreground/60" />
                          : <Check className="h-3 w-3 text-primary-foreground/60" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
