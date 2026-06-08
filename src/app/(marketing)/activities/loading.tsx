export default function ActivitiesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skeleton Nav */}
      <div className="h-20 border-b border-border" />

      {/* Hero skeleton */}
      <div className="relative min-h-[480px] md:min-h-[640px] skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-6 w-48 rounded-full skeleton-shimmer mx-auto" />
          <div className="h-10 w-96 rounded-xl skeleton-shimmer mx-auto" />
          <div className="h-4 w-72 rounded skeleton-shimmer mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
              <div className="h-5 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-3/4 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
