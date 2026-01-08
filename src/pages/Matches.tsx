import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockMatches = [
  {
    id: 1,
    name: "Emma Watson",
    age: 28,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    lastActive: "Online now",
    matchDate: "Matched 2 days ago",
    isNew: true,
  },
  {
    id: 2,
    name: "Sophia Miller",
    age: 26,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    lastActive: "Active 1h ago",
    matchDate: "Matched 5 days ago",
    isNew: false,
  },
  {
    id: 3,
    name: "Olivia Chen",
    age: 29,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    lastActive: "Active 3h ago",
    matchDate: "Matched 1 week ago",
    isNew: false,
  },
];

const Matches = () => {
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

          {/* New Matches */}
          <div className="mb-12">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              New Matches
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {mockMatches.filter(m => m.isNew).map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <Link to={`/messages/${match.id}`}>
                    <div className="relative group">
                      <img
                        src={match.image}
                        alt={match.name}
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-coral/30 group-hover:ring-coral transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <p className="text-center text-sm font-medium mt-2">{match.name.split(' ')[0]}</p>
                  </Link>
                </motion.div>
              ))}
              {mockMatches.filter(m => m.isNew).length === 0 && (
                <div className="text-center py-8 w-full">
                  <p className="text-muted-foreground">No new matches yet. Keep swiping!</p>
                </div>
              )}
            </div>
          </div>

          {/* All Matches */}
          <div>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-coral" />
              All Matches ({mockMatches.length})
            </h2>
            <div className="grid gap-4">
              {mockMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/messages/${match.id}`}>
                    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 hover:shadow-hover transition-all flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={match.image}
                          alt={match.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        {match.lastActive === "Online now" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{match.name}, {match.age}</h3>
                          {match.isNew && (
                            <span className="px-2 py-0.5 rounded-full bg-coral text-primary-foreground text-xs font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{match.lastActive}</p>
                        <p className="text-xs text-muted-foreground mt-1">{match.matchDate}</p>
                      </div>
                      
                      <Button variant="coral" size="icon" className="rounded-xl">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {mockMatches.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">No Matches Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start swiping to find your perfect match!
              </p>
              <Link to="/discover">
                <Button variant="hero">Discover Profiles</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matches;
