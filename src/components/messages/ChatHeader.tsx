import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Match } from "@/hooks/useMatches";
import { usePremium } from "@/hooks/usePremium";
import PremiumModal from "./PremiumModal";

interface ChatHeaderProps {
  match: Match;
  onBack: () => void;
}

const ChatHeader = ({ match, onBack }: ChatHeaderProps) => {
  const { partner_profile } = match;
  const { isPremium } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleCallClick = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    // Premium call logic would go here
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 hover:bg-muted rounded-xl transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        <Avatar className="w-10 h-10 rounded-xl ring-2 ring-border/50">
          <AvatarImage
            src={partner_profile.avatar_url || undefined}
            alt={partner_profile.first_name || "Match"}
            className="object-cover"
          />
          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold text-sm">
            {partner_profile.first_name?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
            {partner_profile.first_name || "Unknown"}
            {partner_profile.last_name ? ` ${partner_profile.last_name}` : ""}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {partner_profile.location || "Matched with you"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCallClick}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCallClick}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="Audio and Video calls"
      />
    </>
  );
};

export default ChatHeader;
