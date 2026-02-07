import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface LoveRequestCardProps {
  id: string;
  senderId: string;
  senderProfile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
  };
  createdAt: string;
  onAccept: () => Promise<boolean>;
  onReject: () => Promise<boolean>;
}

const LoveRequestCard = ({
  id,
  senderId,
  senderProfile,
  createdAt,
  onAccept,
  onReject,
}: LoveRequestCardProps) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept();
    setIsAccepting(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await onReject();
    setIsRejecting(false);
  };

  const name = senderProfile.first_name 
    ? `${senderProfile.first_name}${senderProfile.last_name ? ` ${senderProfile.last_name}` : ''}`
    : 'Someone';

  const initials = senderProfile.first_name?.[0]?.toUpperCase() || '?';

  const timeAgo = new Date(createdAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border/50"
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 rounded-xl">
          <AvatarImage src={senderProfile.avatar_url || undefined} alt={name} />
          <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{name}</h3>
          {senderProfile.location && (
            <p className="text-sm text-muted-foreground truncate">{senderProfile.location}</p>
          )}
          <p className="text-xs text-muted-foreground">Sent {timeAgo}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReject}
            disabled={isRejecting || isAccepting}
            className="rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
          >
            {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
          <Button
            variant="coral"
            size="icon"
            onClick={handleAccept}
            disabled={isRejecting || isAccepting}
            className="rounded-xl"
          >
            {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {senderProfile.bio && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{senderProfile.bio}</p>
      )}
    </motion.div>
  );
};

export default LoveRequestCard;
