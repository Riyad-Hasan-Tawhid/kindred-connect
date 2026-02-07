-- Add like_count and dislike_count columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislike_count integer NOT NULL DEFAULT 0;

-- Create profile_reactions table (tracks likes/dislikes to prevent duplicates)
CREATE TABLE public.profile_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_profile_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_profile_id)
);

-- Create love_requests table (friend requests)
CREATE TABLE public.love_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

-- Create matches table (created when love request is accepted)
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table (chat between matched users)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_profile_reactions_user_id ON public.profile_reactions(user_id);
CREATE INDEX idx_profile_reactions_target ON public.profile_reactions(target_profile_id);
CREATE INDEX idx_love_requests_sender ON public.love_requests(sender_id);
CREATE INDEX idx_love_requests_receiver ON public.love_requests(receiver_id);
CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_messages_match ON public.messages(match_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- Enable RLS on all tables
ALTER TABLE public.profile_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS for profile_reactions
CREATE POLICY "Users can insert their own reactions"
ON public.profile_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reactions"
ON public.profile_reactions FOR SELECT
USING (auth.uid() = user_id);

-- RLS for love_requests
CREATE POLICY "Users can send love requests"
ON public.love_requests FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their sent and received requests"
ON public.love_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Receivers can update request status"
ON public.love_requests FOR UPDATE
USING (auth.uid() = receiver_id);

-- RLS for matches
CREATE POLICY "Users can view their matches"
ON public.matches FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches"
ON public.matches FOR INSERT
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS for messages (only matched users can access)
CREATE POLICY "Matched users can view messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Matched users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Users can mark their received messages as read"
ON public.messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
  AND sender_id != auth.uid()
);

-- Trigger to update updated_at on love_requests
CREATE TRIGGER update_love_requests_updated_at
BEFORE UPDATE ON public.love_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.love_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;