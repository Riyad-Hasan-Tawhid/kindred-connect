import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface LoveRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender_profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
  };
}

export const useLoveRequests = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<LoveRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<LoveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!user) {
      setPendingRequests([]);
      setSentRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch received pending requests
      const { data: received, error: receivedError } = await supabase
        .from("love_requests")
        .select("*")
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (receivedError) {
        console.error("Error fetching received requests:", receivedError);
      } else {
        // Fetch sender profiles for each request
        const requestsWithProfiles = await Promise.all(
          (received || []).map(async (req) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id, first_name, last_name, avatar_url, location, bio")
              .eq("user_id", req.sender_id)
              .single();
            
            return { 
              ...req, 
              status: req.status as 'pending' | 'accepted' | 'rejected',
              sender_profile: profile || undefined 
            };
          })
        );
        setPendingRequests(requestsWithProfiles as LoveRequest[]);
      }

      // Fetch sent requests
      const { data: sent, error: sentError } = await supabase
        .from("love_requests")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false });

      if (sentError) {
        console.error("Error fetching sent requests:", sentError);
      } else {
        setSentRequests((sent || []).map(s => ({
          ...s,
          status: s.status as 'pending' | 'accepted' | 'rejected'
        })));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendLoveRequest = useCallback(async (receiverId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to send love requests");
      return false;
    }

    try {
      // Check if request already exists
      const { data: existing } = await supabase
        .from("love_requests")
        .select("id, status")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'pending') {
          toast.info("Love request already sent!");
        } else if (existing.status === 'accepted') {
          toast.info("You're already matched! 💕");
        } else {
          toast.info("Request was previously declined");
        }
        return false;
      }

      // Insert new love request
      const { error } = await supabase
        .from("love_requests")
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: "pending",
        });

      if (error) {
        console.error("Error sending love request:", error);
        toast.error("Failed to send love request");
        return false;
      }

      toast.success("Love request sent! 💕");
      await fetchRequests();
      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      return false;
    }
  }, [user, fetchRequests]);

  const respondToRequest = useCallback(async (
    requestId: string, 
    senderId: string,
    accept: boolean
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const newStatus = accept ? 'accepted' : 'rejected';
      
      // Update the request status
      const { error: updateError } = await supabase
        .from("love_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (updateError) {
        console.error("Error updating request:", updateError);
        toast.error("Failed to respond to request");
        return false;
      }

      // If accepted, create a match
      if (accept) {
        const { error: matchError } = await supabase
          .from("matches")
          .insert({
            user1_id: senderId,
            user2_id: user.id,
          });

        if (matchError) {
          console.error("Error creating match:", matchError);
          // Still show success since the request was accepted
        }

        toast.success("It's a match! 🎉 You can now chat!");
      } else {
        toast("Request declined");
      }

      await fetchRequests();
      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      return false;
    }
  }, [user, fetchRequests]);

  const checkLoveRequestStatus = useCallback(async (targetUserId: string): Promise<'pending' | 'accepted' | 'rejected' | 'none'> => {
    if (!user) return 'none';

    const { data } = await supabase
      .from("love_requests")
      .select("status")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
      .maybeSingle();

    return (data?.status as 'pending' | 'accepted' | 'rejected') || 'none';
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('love_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'love_requests',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchRequests]);

  return {
    pendingRequests,
    sentRequests,
    loading,
    sendLoveRequest,
    respondToRequest,
    checkLoveRequestStatus,
    refetch: fetchRequests,
  };
};
