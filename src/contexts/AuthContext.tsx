import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SignUpMetadata {
  first_name?: string;
  last_name?: string;
  birthday?: string;
  gender?: string;
  location?: string;
  looking_for?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<{ needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  ensureProfile: () => Promise<void>;
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
        console.log("Auth state change:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // If user just signed in, ensure their profile exists
        if (event === "SIGNED_IN" && session) {
          // Use setTimeout to avoid blocking the auth flow
          setTimeout(() => {
            ensureProfileExists(session);
          }, 100);
        }
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

  const ensureProfileExists = async (currentSession: Session, additionalData?: SignUpMetadata) => {
    try {
      const metadata = currentSession.user.user_metadata || {};
      const profileData = {
        first_name: additionalData?.first_name || metadata.first_name,
        last_name: additionalData?.last_name || metadata.last_name,
        birthday: additionalData?.birthday || metadata.birthday,
        gender: additionalData?.gender || metadata.gender,
        location: additionalData?.location || metadata.location,
        looking_for: additionalData?.looking_for || metadata.looking_for,
      };

      const response = await supabase.functions.invoke("create-profile", {
        body: profileData,
      });

      if (response.error) {
        console.error("Error ensuring profile:", response.error);
      } else {
        console.log("Profile ensured:", response.data);
      }
    } catch (error) {
      console.error("Error calling create-profile function:", error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata): Promise<{ needsEmailConfirmation: boolean }> => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
        data: metadata,
      },
    });

    if (error) {
      // Map common Supabase errors to user-friendly messages
      if (error.message.includes("User already registered")) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }
      if (error.message.includes("Password")) {
        throw new Error("Password is too weak. Please use a stronger password.");
      }
      throw error;
    }

    // Check if email confirmation is required
    const needsEmailConfirmation = !data.session;

    // If we have a session immediately (email confirmation disabled), create profile
    if (data.session) {
      await ensureProfileExists(data.session, metadata);
    }

    return { needsEmailConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (!password) {
      throw new Error("Please enter your password");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Map common Supabase errors to user-friendly messages
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please try again.");
      }
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Please verify your email address before signing in. Check your inbox for the confirmation link.");
      }
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const ensureProfile = async () => {
    if (session) {
      await ensureProfileExists(session);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, ensureProfile }}>
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
