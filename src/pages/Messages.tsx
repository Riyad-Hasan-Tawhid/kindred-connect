import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/hooks/useMatches";
import { useMessages } from "@/hooks/useMessages";
import { ConversationSkeleton, MessageSkeleton } from "@/components/matches/MatchSkeletons";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading: matchesLoading } = useMatches();
  const { messages, loading: messagesLoading, sending, sendMessage } = useMessages(id || null);
  
  const [message, setMessage] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(id || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // Update selected match when URL changes
  useEffect(() => {
    if (id) {
      setSelectedMatchId(id);
    }
  }, [id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    
    const success = await sendMessage(message);
    if (success) {
      setMessage("");
    }
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    navigate(`/messages/${matchId}`);
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Send className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Sign In to Message</h3>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to chat with your matches.
            </p>
            <Button onClick={() => navigate("/login")}>
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
        <div className="container mx-auto h-[calc(100vh-4rem)] flex">
          {/* Conversations List */}
          <div className={`w-full md:w-96 border-r border-border flex flex-col ${selectedMatchId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-border">
              <h1 className="font-display text-2xl font-bold">Messages</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {matchesLoading ? (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              ) : matches.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No matches yet. Start discovering!</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/discover')}
                    className="mt-2"
                  >
                    Go to Discover
                  </Button>
                </div>
              ) : (
                matches.map((match, index) => (
                  <motion.button
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectMatch(match.id)}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                      selectedMatchId === match.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-14 h-14 rounded-xl">
                        <AvatarImage 
                          src={match.partner_profile.avatar_url || undefined}
                          alt={match.partner_profile.first_name || 'Match'}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                          {match.partner_profile.first_name?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">
                          {match.partner_profile.first_name || 'Unknown'}
                        </h3>
                        {match.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(match.last_message.created_at), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {match.last_message 
                          ? `${match.last_message.sender_id === user.id ? 'You: ' : ''}${match.last_message.content}`
                          : 'Start a conversation!'}
                      </p>
                    </div>
                    
                    {match.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-coral text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {match.unread_count}
                      </span>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedMatchId ? 'flex' : 'hidden md:flex'}`}>
            {selectedMatch ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedMatchId(null);
                      navigate('/messages');
                    }}
                    className="md:hidden p-2 hover:bg-muted rounded-lg"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  
                  <Avatar className="w-10 h-10 rounded-xl">
                    <AvatarImage 
                      src={selectedMatch.partner_profile.avatar_url || undefined}
                      alt={selectedMatch.partner_profile.first_name || 'Match'}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                      {selectedMatch.partner_profile.first_name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {selectedMatch.partner_profile.first_name || 'Unknown'}
                      {selectedMatch.partner_profile.last_name ? ` ${selectedMatch.partner_profile.last_name}` : ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedMatch.partner_profile.location || 'Matched'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <>
                      <MessageSkeleton sent={false} />
                      <MessageSkeleton sent={true} />
                      <MessageSkeleton sent={false} />
                    </>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">
                          This is the start of your conversation with{' '}
                          {selectedMatch.partner_profile.first_name || 'your match'}
                        </p>
                        <p className="text-sm text-muted-foreground">Say hello! 👋</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                              msg.sender_id === user.id
                                ? 'gradient-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                            }`}
                          >
                            <p className="break-words">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === user.id 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {formatMessageTime(msg.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button
                      variant="hero"
                      size="icon"
                      onClick={handleSend}
                      disabled={!message.trim() || sending}
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Your Messages</h3>
                  <p className="text-muted-foreground">
                    {matches.length > 0 
                      ? 'Select a conversation to start chatting'
                      : 'Match with someone to start chatting'}
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
