import { useState, useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const AvatarUpload = ({ 
  currentAvatarUrl, 
  onUploadComplete,
  size = "lg" 
}: AvatarUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const buttonSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2"
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, WebP, or GIF)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image must be less than 5MB";
    }
    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      // Generate unique filename with user ID as folder
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      onUploadComplete(publicUrl);
      toast.success("Profile photo updated!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      setPreviewUrl(null); // Revert to previous
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "rounded-full gradient-primary flex items-center justify-center overflow-hidden transition-all duration-200",
          sizeClasses[size],
          uploading && "opacity-70"
        )}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <User className={cn("text-primary-foreground", iconSizes[size])} />
        )}
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "absolute bottom-0 right-0 rounded-full bg-card border border-border shadow-sm transition-all duration-200",
          "hover:bg-muted hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          buttonSizes[size]
        )}
        aria-label="Upload profile photo"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Camera className="h-5 w-5" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Choose profile photo"
      />
    </div>
  );
};

export default AvatarUpload;
