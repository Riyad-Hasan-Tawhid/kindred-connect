-- Drop the overly permissive policy
DROP POLICY "Anyone can update like/dislike counts" ON public.profiles;

-- Create a more targeted policy: authenticated users can update like/dislike counts on any profile
CREATE POLICY "Authenticated users can update reaction counts"
ON public.profiles
FOR UPDATE
USING (auth.uid() IS NOT NULL);
