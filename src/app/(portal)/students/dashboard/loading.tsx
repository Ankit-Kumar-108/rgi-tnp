import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skeleton Nav */}
      <div className="h-20 border-b border-border" />

      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 mt-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 rounded-2xl skeleton-shimmer" />
          <div className="h-10 w-36 rounded-2xl skeleton-shimmer" />
          <div className="h-10 w-24 rounded-2xl skeleton-shimmer" />
        </div>

        {/* Profile Card skeleton */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-10 w-64 rounded-xl skeleton-shimmer" />
            <div className="h-5 w-32 rounded skeleton-shimmer" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 rounded skeleton-shimmer" />
                  <div className="h-7 w-16 rounded skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 md:p-6 border border-border space-y-4">
              <div className="w-11 h-11 rounded-xl skeleton-shimmer" />
              <div className="h-8 w-12 rounded skeleton-shimmer" />
              <div className="h-3 w-24 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Content loading indicator */}
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      </div>
    </div>
  );
}
