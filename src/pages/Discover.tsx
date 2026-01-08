import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/ui/ProfileCard";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, MapPin, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockProfiles = [
  {
    id: 1,
    name: "Emma Watson",
    age: 28,
    location: "New York, NY",
    occupation: "Interior Designer",
    bio: "Creative soul who loves art galleries, sunset walks, and discovering hidden coffee shops. Looking for someone to share adventures with!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    compatibility: 95,
    interests: ["Art", "Travel", "Coffee", "Photography"],
  },
  {
    id: 2,
    name: "Sophia Miller",
    age: 26,
    location: "Los Angeles, CA",
    occupation: "Marketing Manager",
    bio: "Fitness enthusiast and foodie. I believe in balance - gym in the morning, tacos at night. Let's explore the city together!",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    compatibility: 88,
    interests: ["Fitness", "Food", "Hiking", "Music"],
  },
  {
    id: 3,
    name: "Olivia Chen",
    age: 29,
    location: "San Francisco, CA",
    occupation: "Software Engineer",
    bio: "Tech geek by day, book worm by night. I'm looking for someone who can recommend their favorite books and debate about sci-fi movies.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    compatibility: 92,
    interests: ["Books", "Tech", "Sci-Fi", "Board Games"],
  },
  {
    id: 4,
    name: "Isabella Rose",
    age: 27,
    location: "Chicago, IL",
    occupation: "Nurse",
    bio: "Caring by nature. Love cooking Italian food, weekend brunches, and long conversations. Looking for genuine connection.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    compatibility: 85,
    interests: ["Cooking", "Healthcare", "Wine", "Travel"],
  },
];

const Discover = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleLike = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, mockProfiles.length - 1));
  };

  const handlePass = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, mockProfiles.length - 1));
  };

  const handleSuperLike = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, mockProfiles.length - 1));
  };

  const currentProfile = mockProfiles[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">
                Discover <span className="text-gradient">Matches</span>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {mockProfiles.length} profiles near you
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card rounded-2xl p-6 mb-8 shadow-card border border-border/50 overflow-hidden"
              >
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Age Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                        defaultValue={18}
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                        defaultValue={40}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="City or ZIP"
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-sm"
                        defaultValue="New York, NY"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Distance</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                      <option>10 miles</option>
                      <option>25 miles</option>
                      <option>50 miles</option>
                      <option>100 miles</option>
                      <option>Anywhere</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Looking For</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                      <option>Relationship</option>
                      <option>Casual Dating</option>
                      <option>Friendship</option>
                      <option>Not Sure Yet</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="ghost">Reset</Button>
                  <Button>Apply Filters</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Cards */}
          <div className="flex justify-center">
            {currentIndex < mockProfiles.length ? (
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  {...currentProfile}
                  onLike={handleLike}
                  onPass={handlePass}
                  onSuperLike={handleSuperLike}
                />
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">No More Profiles</h3>
                <p className="text-muted-foreground mb-6">
                  You've seen all available matches in your area.
                </p>
                <Button onClick={() => setCurrentIndex(0)}>
                  Start Over
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
