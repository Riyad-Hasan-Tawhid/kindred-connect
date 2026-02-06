import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  gender: string | null;
  location: string | null;
  looking_for: string | null;
  bio: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user, session, ensureProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        setError("Failed to load profile");
        toast.error("Error loading profile");
        return;
      }

      if (!data) {
        // Profile doesn't exist yet, try to create it via edge function
        console.log("Profile not found, attempting to create...");
        await ensureProfile();
        
        // Retry fetch after a short delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (retryError) {
          console.error("Error fetching profile after creation:", retryError);
          setError("Failed to load profile");
        } else {
          setProfile(retryData);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [user, ensureProfile]);

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: any }> => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return { error: "Not authenticated" };
    }

    try {
      // Clean up the updates - remove id, user_id, created_at, updated_at
      const { id, user_id, created_at, updated_at, ...cleanUpdates } = updates as any;
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast.error("Failed to update profile");
        return { error: updateError };
      }

      toast.success("Profile updated successfully");
      await fetchProfile(); // Refresh profile data
      return { error: null };
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
      toast.error("An unexpected error occurred");
      return { error: err };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    error,
    updateProfile, 
    refetch: fetchProfile 
  };
};
