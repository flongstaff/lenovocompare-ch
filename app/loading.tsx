import { SkeletonGrid } from "@/components/ui/Skeleton";

const Loading = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 px-1">
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <span className="text-sm text-carbon-400">Loading models...</span>
    </div>
    <SkeletonGrid count={8} />
  </div>
);

export default Loading;
