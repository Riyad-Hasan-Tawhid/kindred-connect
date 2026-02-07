import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  partner_profile: {
    id: string;
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
  };
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
    sender_id: string;
  };
  unread_count: number;
}

export const useMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!user) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch matches where user is either user1 or user2
      const { data: matchesData, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
        return;
      }

      // For each match, fetch the partner's profile and last message
      const matchesWithProfiles = await Promise.all(
        (matchesData || []).map(async (match) => {
          const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          // Fetch partner profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, user_id, first_name, last_name, avatar_url, location, bio")
            .eq("user_id", partnerId)
            .single();

          // Fetch last message
          const { data: messages } = await supabase
            .from("messages")
            .select("content, created_at, is_read, sender_id")
            .eq("match_id", match.id)
            .order("created_at", { ascending: false })
            .limit(1);

          // Count unread messages
          const { count } = await supabase
            .from("messages")
            .select("*", { count: 'exact', head: true })
            .eq("match_id", match.id)
            .eq("is_read", false)
            .neq("sender_id", user.id);

          return {
            ...match,
            partner_profile: profile || {
              id: '',
              user_id: partnerId,
              first_name: 'Unknown',
              last_name: null,
              avatar_url: null,
              location: null,
              bio: null,
            },
            last_message: messages?.[0],
            unread_count: count || 0,
          };
        })
      );

      setMatches(matchesWithProfiles);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Subscribe to real-time match updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMatches]);

  return { matches, loading, refetch: fetchMatches };
};
