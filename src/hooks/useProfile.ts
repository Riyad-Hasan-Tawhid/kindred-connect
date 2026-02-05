 import { useState, useEffect } from "react";
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
   const { user } = useAuth();
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
 
   const fetchProfile = async () => {
     if (!user) {
       setProfile(null);
       setLoading(false);
       return;
     }
 
     try {
       const { data, error } = await supabase
         .from("profiles")
         .select("*")
         .eq("user_id", user.id)
         .maybeSingle();
 
       if (error) {
         console.error("Error fetching profile:", error);
         toast.error("Error loading profile");
       } else {
         setProfile(data);
       }
     } catch (error) {
       console.error("Error fetching profile:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const updateProfile = async (updates: Partial<Profile>) => {
     if (!user) return { error: "Not authenticated" };
 
     try {
       const { error } = await supabase
         .from("profiles")
         .update(updates)
         .eq("user_id", user.id);
 
       if (error) {
         toast.error("Error updating profile");
         return { error };
       }
 
       toast.success("Profile updated successfully");
       await fetchProfile(); // Refresh profile data
       return { error: null };
     } catch (error) {
       toast.error("Error updating profile");
       return { error };
     }
   };
 
   useEffect(() => {
     fetchProfile();
   }, [user]);
 
   return { profile, loading, updateProfile, refetch: fetchProfile };
 };