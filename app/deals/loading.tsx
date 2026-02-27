const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-48 rounded bg-carbon-600" />
    <div className="h-20 rounded-lg bg-carbon-600" />
    <div className="flex gap-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-8 w-20 rounded bg-carbon-600" />
      ))}
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-40 rounded-lg bg-carbon-600" />
      ))}
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-12 rounded bg-carbon-600" />
      ))}
    </div>
  </div>
);

export default Loading;
