 import { createContext, useContext, useEffect, useState, ReactNode } from "react";
 import { User, Session } from "@supabase/supabase-js";
 import { supabase } from "@/integrations/supabase/client";
 import { useNavigate } from "react-router-dom";
 import { toast } from "sonner";
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   loading: boolean;
   signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
   signIn: (email: string, password: string) => Promise<void>;
   signOut: () => Promise<void>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     // Set up auth state listener BEFORE checking for existing session
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
       }
     );
 
     // Check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
     const { error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: window.location.origin,
         data: metadata,
       },
     });
 
     if (error) {
       throw error;
     }
   };
 
   const signIn = async (email: string, password: string) => {
     const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
 
     if (error) {
       throw error;
     }
   };
 
   const signOut = async () => {
     const { error } = await supabase.auth.signOut();
     if (error) {
       throw error;
     }
   };
 
   return (
     <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
       {children}
     </AuthContext.Provider>
   );
 };
 
 export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
 };