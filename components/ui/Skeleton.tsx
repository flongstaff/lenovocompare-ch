"use client";

export const SkeletonCard = () => (
  <div className="carbon-card flex animate-pulse flex-col">
    <div className="bg-carbon-600 h-1" />
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="bg-carbon-600 h-3 w-16 rounded" />
          <div className="bg-carbon-600 h-5 w-3/4 rounded" />
          <div className="bg-carbon-600 h-3 w-10 rounded" />
        </div>
        <div className="bg-carbon-600 h-8 w-8 rounded" />
      </div>
      <div className="space-y-2">
        <div className="bg-carbon-600 h-4 w-full rounded" />
        <div className="bg-carbon-600 h-4 w-5/6 rounded" />
        <div className="bg-carbon-600 h-4 w-4/6 rounded" />
        <div className="bg-carbon-600 h-4 w-3/6 rounded" />
        <div className="bg-carbon-600 h-4 w-2/6 rounded" />
      </div>
      <div className="border-carbon-600 border-t pt-3">
        <div className="bg-carbon-600 h-3 w-20 rounded" />
      </div>
      <div className="border-carbon-600 flex items-center justify-between border-t pt-3">
        <div className="bg-carbon-600 h-6 w-24 rounded" />
        <div className="bg-carbon-600 h-7 w-16 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
