import { Skeleton } from "@/components/ui/skeleton";

export const MatchCardSkeleton = () => (
  <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-4">
    <Skeleton className="w-16 h-16 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="w-10 h-10 rounded-xl" />
  </div>
);

export const ConversationSkeleton = () => (
  <div className="p-4 flex items-center gap-4">
    <Skeleton className="w-14 h-14 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-40" />
    </div>
  </div>
);

export const MessageSkeleton = ({ sent = false }: { sent?: boolean }) => (
  <div className={`flex ${sent ? 'justify-end' : 'justify-start'}`}>
    <Skeleton className={`h-16 ${sent ? 'w-48' : 'w-56'} rounded-2xl`} />
  </div>
);
