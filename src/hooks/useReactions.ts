import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useReactions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const addReaction = useCallback(async (
    targetProfileId: string, 
    reactionType: 'like' | 'dislike'
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to react to profiles");
      return false;
    }

    setLoading(true);
    try {
      // First check if reaction already exists
      const { data: existing } = await supabase
        .from("profile_reactions")
        .select("id, reaction_type")
        .eq("user_id", user.id)
        .eq("target_profile_id", targetProfileId)
        .maybeSingle();

      if (existing) {
        toast.info(`You've already ${existing.reaction_type === 'like' ? 'liked' : 'disliked'} this profile`);
        return false;
      }

      // Insert the reaction
      const { error: insertError } = await supabase
        .from("profile_reactions")
        .insert({
          user_id: user.id,
          target_profile_id: targetProfileId,
          reaction_type: reactionType,
        });

      if (insertError) {
        console.error("Error adding reaction:", insertError);
        toast.error("Failed to add reaction");
        return false;
      }

      // Update the profile's like/dislike count
      const column = reactionType === 'like' ? 'like_count' : 'dislike_count';
      
      // Get current count
      const { data: profile } = await supabase
        .from("profiles")
        .select(column)
        .eq("id", targetProfileId)
        .single();

      if (profile) {
        const currentCount = (profile as any)[column] || 0;
        await supabase
          .from("profiles")
          .update({ [column]: currentCount + 1 })
          .eq("id", targetProfileId);
      }

      if (reactionType === 'like') {
        toast.success("You liked this profile! 👍");
      } else {
        toast("Passed on this profile");
      }

      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkReaction = useCallback(async (targetProfileId: string): Promise<'like' | 'dislike' | null> => {
    if (!user) return null;

    const { data } = await supabase
      .from("profile_reactions")
      .select("reaction_type")
      .eq("user_id", user.id)
      .eq("target_profile_id", targetProfileId)
      .maybeSingle();

    return data?.reaction_type as 'like' | 'dislike' | null;
  }, [user]);

  return { addReaction, checkReaction, loading };
};
