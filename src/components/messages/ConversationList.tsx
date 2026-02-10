import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MessageCircleHeart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationSkeleton } from "@/components/matches/MatchSkeletons";
import { Match } from "@/hooks/useMatches";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface ConversationListProps {
  matches: Match[];
  loading: boolean;
  selectedMatchId: string | null;
  userId: string;
  onSelectMatch: (matchId: string) => void;
  onNavigateDiscover: () => void;
}

const ConversationList = ({
  matches,
  loading,
  selectedMatchId,
  userId,
  onSelectMatch,
  onNavigateDiscover,
}: ConversationListProps) => {
  const [search, setSearch] = useState("");

  const filtered = matches.filter((m) =>
    (m.partner_profile.first_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your conversations</p>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {loading ? (
            <div className="space-y-1">
              {[...Array(4)].map((_, i) => (
                <ConversationSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                <MessageCircleHeart className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground mb-1">
                {matches.length === 0 ? "No matches yet" : "No results"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {matches.length === 0
                  ? "Start discovering people to match with!"
                  : "Try a different search term"}
              </p>
              {matches.length === 0 && (
                <Button variant="outline" size="sm" onClick={onNavigateDiscover}>
                  Discover People
                </Button>
              )}
            </div>
          ) : (
            filtered.map((match, index) => (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                onClick={() => onSelectMatch(match.id)}
                className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200 group ${
                  selectedMatchId === match.id
                    ? "bg-accent shadow-sm"
                    : "hover:bg-muted/60"
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="w-12 h-12 rounded-xl ring-2 ring-border/50">
                    <AvatarImage
                      src={match.partner_profile.avatar_url || undefined}
                      alt={match.partner_profile.first_name || "Match"}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                      {match.partner_profile.first_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {match.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {match.unread_count > 9 ? "9+" : match.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-sm truncate ${match.unread_count > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                      {match.partner_profile.first_name || "Unknown"}
                    </h3>
                    {match.last_message && (
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(new Date(match.last_message.created_at), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <p className={`text-[13px] truncate ${match.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {match.last_message
                      ? `${match.last_message.sender_id === userId ? "You: " : ""}${match.last_message.content}`
                      : "Start a conversation! 👋"}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
