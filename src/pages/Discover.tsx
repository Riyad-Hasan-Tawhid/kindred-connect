import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/ui/ProfileCard";
import ProfileCardSkeleton from "@/components/discover/ProfileCardSkeleton";
import DiscoverFilters from "@/components/discover/DiscoverFilters";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Users, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscoverProfiles } from "@/hooks/useDiscoverProfiles";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Discover = () => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(100);
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("anywhere");
  const [lookingFor, setLookingFor] = useState("");
  
  // Applied filters (only update on Apply click)
  const [appliedFilters, setAppliedFilters] = useState({
    ageMin: 18,
    ageMax: 100,
    location: "",
    lookingFor: "",
  });

  const { profiles, loading, error, refetch, totalCount } = useDiscoverProfiles(appliedFilters);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      ageMin,
      ageMax,
      location,
      lookingFor,
    });
    setCurrentIndex(0);
    setShowFilters(false);
  }, [ageMin, ageMax, location, lookingFor]);

  const handleResetFilters = useCallback(() => {
    setAgeMin(18);
    setAgeMax(100);
    setLocation("");
    setDistance("anywhere");
    setLookingFor("");
  }, []);

  const handleLike = useCallback(() => {
    toast.success("You liked this profile! 💕");
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePass = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleSuperLike = useCallback(() => {
    toast.success("Super Like sent! ⭐");
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    setCurrentIndex(0);
    refetch();
  }, [refetch]);

  const currentProfile = profiles[currentIndex];

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Sign In to Discover</h3>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to start discovering matches.
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">
                Discover <span className="text-gradient">Matches</span>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {loading ? "Loading..." : `${totalCount} profiles available`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
              <DiscoverFilters
                ageMin={ageMin}
                ageMax={ageMax}
                location={location}
                distance={distance}
                lookingFor={lookingFor}
                onAgeMinChange={setAgeMin}
                onAgeMaxChange={setAgeMax}
                onLocationChange={setLocation}
                onDistanceChange={setDistance}
                onLookingForChange={setLookingFor}
                onReset={handleResetFilters}
                onApply={handleApplyFilters}
              />
            )}
          </AnimatePresence>

          {/* Profile Cards */}
          <div className="flex justify-center">
            {loading ? (
              <ProfileCardSkeleton />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Error Loading Profiles</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={handleRefresh}>Try Again</Button>
              </motion.div>
            ) : profiles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">No Profiles Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to complete your profile and start matching!
                </p>
                <Button onClick={() => window.location.href = "/profile"}>
                  Complete Your Profile
                </Button>
              </motion.div>
            ) : currentIndex < profiles.length ? (
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  name={`${currentProfile.first_name || "Anonymous"}${currentProfile.last_name ? ` ${currentProfile.last_name}` : ""}`}
                  age={currentProfile.age || 0}
                  location={currentProfile.location || "Nearby"}
                  occupation={currentProfile.occupation}
                  bio={currentProfile.bio || "No bio yet"}
                  image={currentProfile.image}
                  compatibility={currentProfile.compatibility}
                  interests={currentProfile.interests || []}
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
                  You've seen all available matches. Check back later for new profiles!
                </p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Profiles
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
