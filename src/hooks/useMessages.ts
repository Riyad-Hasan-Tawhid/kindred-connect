import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export const useMessages = (matchId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user || !matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
        
        // Mark received messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("match_id", matchId)
          .eq("is_read", false)
          .neq("sender_id", user.id);
      }
    } finally {
      setLoading(false);
    }
  }, [user, matchId]);

  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!user || !matchId || !content.trim()) {
      return false;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: content.trim(),
        });

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      return false;
    } finally {
      setSending(false);
    }
  }, [user, matchId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!user || !matchId) return;

    const channel = supabase
      .channel(`messages_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Mark as read if we're the receiver
          if (newMessage.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, matchId]);

  return { messages, loading, sending, sendMessage, refetch: fetchMessages };
};
