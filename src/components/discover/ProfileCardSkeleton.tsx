import { Skeleton } from "@/components/ui/skeleton";

const ProfileCardSkeleton = () => {
  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden border border-border/50 max-w-sm w-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4]">
        <Skeleton className="w-full h-full" />
        
        {/* Compatibility Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-24 h-7 rounded-full" />
        </div>

        {/* Info Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <Skeleton className="h-8 w-40 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-32 mb-1 bg-white/20" />
          <Skeleton className="h-4 w-28 bg-white/20" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Bio Skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />

        {/* Interests Skeleton */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-14 h-14 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
