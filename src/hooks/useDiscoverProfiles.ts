import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DiscoverProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  gender: string | null;
  location: string | null;
  bio: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_premium: boolean;
}

export interface DiscoverProfileWithMeta extends DiscoverProfile {
  age: number | null;
  compatibility: number;
  occupation: string;
  image: string;
}

const calculateAge = (birthday: string | null): number | null => {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateCompatibility = (
  userInterests: string[] | null,
  profileInterests: string[] | null
): number => {
  if (!userInterests?.length || !profileInterests?.length) {
    return Math.floor(Math.random() * 30) + 60; // Random 60-90 if no interests
  }
  
  const userSet = new Set(userInterests.map(i => i.toLowerCase()));
  const matchCount = profileInterests.filter(i => userSet.has(i.toLowerCase())).length;
  const totalUnique = new Set([...userInterests, ...profileInterests]).size;
  
  // Base score 50 + up to 50 based on overlap
  return Math.min(99, Math.floor(50 + (matchCount / totalUnique) * 50));
};

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";

interface UseDiscoverProfilesOptions {
  ageMin?: number;
  ageMax?: number;
  location?: string;
  lookingFor?: string;
}

export const useDiscoverProfiles = (options: UseDiscoverProfilesOptions = {}) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DiscoverProfileWithMeta[]>([]);
  const [userInterests, setUserInterests] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get current user's interests for compatibility calculation
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("interests")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserInterests(currentUserProfile?.interests ?? null);

      // Fetch all other profiles with required fields
      let query = supabase
        .from("profiles")
        .select("*")
        .neq("user_id", user.id) // Exclude current user
        .not("first_name", "is", null); // Only profiles with first_name filled

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching profiles:", fetchError);
        setError("Failed to load profiles");
        return;
      }

      // Transform and filter profiles
      const transformedProfiles: DiscoverProfileWithMeta[] = (data || [])
        .map((profile): DiscoverProfileWithMeta => {
          const age = calculateAge(profile.birthday);
          return {
            ...profile,
            is_verified: profile.is_verified ?? false,
            is_premium: profile.is_premium ?? false,
            age,
            compatibility: calculateCompatibility(
              currentUserProfile?.interests ?? null,
              profile.interests
            ),
            occupation: profile.looking_for || "Looking for connection",
            image: profile.avatar_url || DEFAULT_AVATAR,
          };
        })
        .filter((profile) => {
          // Apply age filters
          if (options.ageMin && profile.age && profile.age < options.ageMin) return false;
          if (options.ageMax && profile.age && profile.age > options.ageMax) return false;
          
          // Apply location filter
          if (options.location && profile.location) {
            const locationMatch = profile.location
              .toLowerCase()
              .includes(options.location.toLowerCase());
            if (!locationMatch) return false;
          }
          
          return true;
        });

      setProfiles(transformedProfiles);
    } catch (err) {
      console.error("Unexpected error fetching profiles:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [user, options.ageMin, options.ageMax, options.location]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    totalCount: profiles.length,
  };
};
