"use client";

const LINEUP_COLORS = ["#a8a8a8", "#4589ff", "#ff832b"] as const;

export const SkeletonCard = ({ index = 0 }: { index?: number }) => {
  const accentColor = LINEUP_COLORS[index % LINEUP_COLORS.length];

  return (
    <div className="carbon-card flex animate-pulse flex-col overflow-hidden">
      <div
        className="skeleton-accent h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60 60%, transparent)` }}
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-carbon-600" />
            <div className="h-5 w-3/4 bg-carbon-600" />
            <div className="h-3 w-10 bg-carbon-600" />
            <div className="mt-1 flex gap-1.5">
              <div className="h-4 w-10 bg-carbon-600" />
              <div className="h-4 w-14 bg-carbon-600" />
            </div>
          </div>
          <div className="h-8 w-8 bg-carbon-600" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-carbon-600" />
          <div className="h-4 w-5/6 bg-carbon-600" />
          <div className="h-4 w-4/6 bg-carbon-600" />
          <div className="h-4 w-3/6 bg-carbon-600" />
          <div className="h-4 w-2/6 bg-carbon-600" />
        </div>
        <div className="border-t border-carbon-600 pt-3">
          <div className="h-3 w-20 bg-carbon-600" />
        </div>
        <div className="flex items-center justify-between border-t border-carbon-600 pt-3">
          <div className="h-6 w-24 bg-carbon-600" />
          <div className="h-7 w-16 bg-carbon-600" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} index={i} />
    ))}
  </div>
);
