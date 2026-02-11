-- Allow users to delete their own reactions (for toggle behavior)
CREATE POLICY "Users can delete their own reactions"
ON public.profile_reactions
FOR DELETE
USING (auth.uid() = user_id);

-- Allow anyone to update profile like/dislike counts
CREATE POLICY "Anyone can update like/dislike counts"
ON public.profiles
FOR UPDATE
USING (true)
WITH CHECK (true);
