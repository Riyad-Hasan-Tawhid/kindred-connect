import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Sparkles, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/hooks/useMatches";
import { useLoveRequests } from "@/hooks/useLoveRequests";
import { MatchCardSkeleton } from "@/components/matches/MatchSkeletons";
import LoveRequestCard from "@/components/matches/LoveRequestCard";
import { formatDistanceToNow } from "date-fns";

const Matches = () => {
  const { user } = useAuth();
  const { matches, loading: matchesLoading, refetch: refetchMatches } = useMatches();
  const { pendingRequests, loading: requestsLoading, respondToRequest } = useLoveRequests();

  // Separate new matches (last 7 days) from older ones
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const newMatches = matches.filter(m => new Date(m.created_at) > sevenDaysAgo);
  const olderMatches = matches.filter(m => new Date(m.created_at) <= sevenDaysAgo);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Sign In to See Matches</h3>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to view your matches.
            </p>
            <Button onClick={() => window.location.href = "/login"}>
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
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">
              Your <span className="text-gradient">Matches</span>
            </h1>
            <p className="text-muted-foreground">
              Start a conversation with your matches
            </p>
          </div>

          {/* Pending Love Requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-12">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Inbox className="h-5 w-5 text-coral" />
                Love Requests ({pendingRequests.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {pendingRequests.map((request) => (
                    <LoveRequestCard
                      key={request.id}
                      id={request.id}
                      senderId={request.sender_id}
                      senderProfile={request.sender_profile || {
                        first_name: 'Unknown',
                        last_name: null,
                        avatar_url: null,
                        location: null,
                        bio: null,
                      }}
                      createdAt={request.created_at}
                      onAccept={async () => {
                        const success = await respondToRequest(request.id, request.sender_id, true);
                        if (success) refetchMatches();
                        return success;
                      }}
                      onReject={async () => {
                        return await respondToRequest(request.id, request.sender_id, false);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* New Matches */}
          {newMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                New Matches
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {newMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <Link to={`/messages/${match.id}`}>
                      <div className="relative group">
                        <Avatar className="w-24 h-24 rounded-2xl ring-4 ring-coral/30 group-hover:ring-coral transition-all">
                          <AvatarImage 
                            src={match.partner_profile.avatar_url || undefined} 
                            alt={match.partner_profile.first_name || 'Match'} 
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-xl font-semibold">
                            {match.partner_profile.first_name?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        {match.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-coral text-primary-foreground text-xs flex items-center justify-center font-medium">
                            {match.unread_count}
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm font-medium mt-2">
                        {match.partner_profile.first_name || 'Unknown'}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Matches */}
          <div>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-coral" />
              All Matches ({matches.length})
            </h2>
            
            {matchesLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <MatchCardSkeleton key={i} />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">No Matches Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Send love requests to find your perfect match!
                </p>
                <Link to="/discover">
                  <Button variant="hero">Discover Profiles</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/messages/${match.id}`}>
                      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 hover:shadow-hover transition-all flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 rounded-xl">
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
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {match.partner_profile.first_name || 'Unknown'}
                              {match.partner_profile.last_name ? ` ${match.partner_profile.last_name}` : ''}
                            </h3>
                            {newMatches.includes(match) && (
                              <span className="px-2 py-0.5 rounded-full bg-coral text-primary-foreground text-xs font-medium">
                                New
                              </span>
                            )}
                            {match.unread_count > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {match.unread_count} new
                              </span>
                            )}
                          </div>
                          {match.last_message ? (
                            <p className="text-sm text-muted-foreground truncate">
                              {match.last_message.sender_id === user.id ? 'You: ' : ''}
                              {match.last_message.content}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {match.partner_profile.location || 'Start a conversation!'}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Matched {formatDistanceToNow(new Date(match.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <Button variant="coral" size="icon" className="rounded-xl">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
