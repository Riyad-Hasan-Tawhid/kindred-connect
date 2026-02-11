import { useProfile } from "@/hooks/useProfile";

export const usePremium = () => {
  const { profile, loading } = useProfile();
  
  const isPremium = profile?.is_premium ?? false;

  return { isPremium, loading };
};
