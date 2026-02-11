import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Send, MessageCircleHeart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/hooks/useMatches";
import { useMessages } from "@/hooks/useMessages";
import { usePremium } from "@/hooks/usePremium";
import ConversationList from "@/components/messages/ConversationList";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatMessages from "@/components/messages/ChatMessages";
import ChatInput from "@/components/messages/ChatInput";

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading: matchesLoading } = useMatches();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(id || null);
  const { messages, loading: messagesLoading, sending, sendMessage } = useMessages(selectedMatchId);
  const { isPremium } = usePremium();

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  // Count messages sent by current user in this conversation
  const myMessageCount = useMemo(() => {
    if (!user) return 0;
    return messages.filter((m) => m.sender_id === user.id).length;
  }, [messages, user]);

  useEffect(() => {
    if (id) setSelectedMatchId(id);
  }, [id]);

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    navigate(`/messages/${matchId}`);
  };

  const handleBack = () => {
    setSelectedMatchId(null);
    navigate("/messages");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
              <MessageCircleHeart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Sign In to Message</h3>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to chat with your matches.
            </p>
            <Button onClick={() => navigate("/login")} className="gradient-primary text-primary-foreground">
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 h-screen">
        <div className="container mx-auto h-[calc(100vh-4rem)] flex overflow-hidden">
          {/* Sidebar */}
          <div
            className={`w-full md:w-[360px] lg:w-[380px] border-r border-border/50 flex flex-col bg-background ${
              selectedMatchId ? "hidden md:flex" : "flex"
            }`}
          >
            <ConversationList
              matches={matches}
              loading={matchesLoading}
              selectedMatchId={selectedMatchId}
              userId={user.id}
              onSelectMatch={handleSelectMatch}
              onNavigateDiscover={() => navigate("/discover")}
            />
          </div>

          {/* Chat panel */}
          <div
            className={`flex-1 flex flex-col bg-muted/20 ${
              selectedMatchId ? "flex" : "hidden md:flex"
            }`}
          >
            {selectedMatch ? (
              <>
                <ChatHeader match={selectedMatch} onBack={handleBack} />
                <ChatMessages
                  messages={messages}
                  loading={messagesLoading}
                  userId={user.id}
                  partnerName={selectedMatch.partner_profile.first_name || "your match"}
                />
                <ChatInput
                  onSend={sendMessage}
                  sending={sending}
                  messageCount={myMessageCount}
                  isPremium={isPremium}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                    <Send className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                    Your Messages
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
                    {matches.length > 0
                      ? "Select a conversation to start chatting"
                      : "Match with someone to start chatting"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
