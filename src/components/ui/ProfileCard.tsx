import { Heart, X, Star, MapPin, Briefcase, Info } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  image: string;
  compatibility: number;
  interests: string[];
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
}

const ProfileCard = ({
  name,
  age,
  location,
  occupation,
  bio,
  image,
  compatibility,
  interests,
  onLike,
  onPass,
  onSuperLike,
}: ProfileCardProps) => {
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

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
            {name}, {age}
          </h3>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-1">
            <Briefcase className="h-4 w-4" />
            {occupation}
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
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
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onPass}
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={onSuperLike}
            className="w-12 h-12 rounded-full bg-gold flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Star className="h-5 w-5 text-foreground" fill="currentColor" />
          </button>
          
          <button
            onClick={onLike}
            className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-hover"
          >
            <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
