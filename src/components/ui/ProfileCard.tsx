import { Heart, ThumbsUp, ThumbsDown, Loader2, MapPin, GraduationCap, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ProfileCardProps {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  image: string;
  compatibility: number;
  interests: string[];
  likeCount?: number;
  dislikeCount?: number;
  educationLevel?: string;
  instituteName?: string;
  division?: string;
  lookingFor?: string;
  onLike?: () => Promise<boolean>;
  onDislike?: () => Promise<boolean>;
  onLove?: () => Promise<boolean>;
  existingReaction?: 'like' | 'dislike' | null;
  loveStatus?: 'pending' | 'accepted' | 'rejected' | 'none';
}

const ProfileCard = ({
  id,
  userId,
  name,
  age,
  location,
  occupation,
  bio,
  image,
  compatibility,
  interests,
  likeCount = 0,
  dislikeCount = 0,
  educationLevel,
  instituteName,
  division,
  lookingFor,
  onLike,
  onDislike,
  onLove,
  existingReaction,
  loveStatus = 'none',
}: ProfileCardProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [isLoving, setIsLoving] = useState(false);
  const [hasReacted, setHasReacted] = useState<'like' | 'dislike' | null>(existingReaction || null);
  const [currentLoveStatus, setCurrentLoveStatus] = useState(loveStatus);

  useEffect(() => {
    setHasReacted(existingReaction || null);
  }, [existingReaction]);

  useEffect(() => {
    setCurrentLoveStatus(loveStatus);
  }, [loveStatus]);

  const handleLike = async () => {
    if (hasReacted || isLiking || !onLike) return;
    setIsLiking(true);
    const success = await onLike();
    if (success) {
      setHasReacted('like');
    }
    setIsLiking(false);
  };

  const handleDislike = async () => {
    if (hasReacted || isDisliking || !onDislike) return;
    setIsDisliking(true);
    const success = await onDislike();
    if (success) {
      setHasReacted('dislike');
    }
    setIsDisliking(false);
  };

  const handleLove = async () => {
    if (currentLoveStatus !== 'none' || isLoving || !onLove) return;
    setIsLoving(true);
    const success = await onLove();
    if (success) {
      setCurrentLoveStatus('pending');
    }
    setIsLoving(false);
  };

  const getLoveButtonText = () => {
    switch (currentLoveStatus) {
      case 'pending':
        return 'Request Sent';
      case 'accepted':
        return 'Matched! 💕';
      case 'rejected':
        return 'Declined';
      default:
        return 'Send Love';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-3xl shadow-card overflow-hidden border border-border/50 max-w-sm w-full"
    >
      {/* Image */}
      <div className="relative aspect-[3/4]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Compatibility Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Heart className="h-4 w-4" fill="currentColor" />
          {compatibility}% Match
        </div>

        {/* Like/Dislike Counters */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {likeCount}
          </div>
          <div className="px-2 py-1 rounded-full bg-muted/90 text-muted-foreground text-xs font-medium flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" />
            {dislikeCount}
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
            {name}, {age}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-primary-foreground/80 text-sm">
            {division && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {division}
              </span>
            )}
            {educationLevel && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {educationLevel}
              </span>
            )}
            {lookingFor && (
              <span className="flex items-center gap-1">
                <Search className="h-3.5 w-3.5" />
                {lookingFor}
              </span>
            )}
          </div>
          {instituteName && (
            <p className="text-primary-foreground/60 text-xs mt-1">{instituteName}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Bio */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-6">
          {interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Like/Dislike buttons row */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={handleDislike}
              disabled={hasReacted !== null || isDisliking}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: hasReacted === null ? 1.05 : 1 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                ${hasReacted === 'dislike' 
                  ? 'bg-muted text-muted-foreground ring-2 ring-muted-foreground' 
                  : hasReacted !== null 
                    ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed' 
                    : 'bg-muted hover:bg-destructive hover:text-destructive-foreground'
                }`}
            >
              {isDisliking ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ThumbsDown className="h-6 w-6" />
              )}
            </motion.button>
            
            <motion.button
              onClick={handleLike}
              disabled={hasReacted !== null || isLiking}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: hasReacted === null ? 1.05 : 1 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                ${hasReacted === 'like' 
                  ? 'bg-green-500 text-white ring-2 ring-green-400' 
                  : hasReacted !== null 
                    ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed' 
                    : 'bg-muted hover:bg-green-500 hover:text-white'
                }`}
            >
              {isLiking ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ThumbsUp className="h-6 w-6" />
              )}
            </motion.button>
          </div>

          {/* Love button */}
          <motion.button
            onClick={handleLove}
            disabled={currentLoveStatus !== 'none' || isLoving}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: currentLoveStatus === 'none' ? 1.02 : 1 }}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg
              ${currentLoveStatus === 'accepted' 
                ? 'gradient-primary text-primary-foreground' 
                : currentLoveStatus === 'pending'
                  ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                  : currentLoveStatus === 'rejected'
                    ? 'bg-muted text-muted-foreground'
                    : 'gradient-primary text-primary-foreground hover:shadow-hover'
              }`}
          >
            {isLoving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Heart className="h-5 w-5" fill={currentLoveStatus === 'accepted' ? 'currentColor' : 'none'} />
                {getLoveButtonText()}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
