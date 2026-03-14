const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-56 bg-carbon-600" />
    <div className="flex gap-2">
      <div className="h-9 w-16 rounded bg-carbon-600" />
      <div className="h-9 w-16 rounded bg-carbon-600" />
    </div>
    <div className="h-10 w-full bg-carbon-600" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="carbon-card space-y-3 p-5">
          <div className="h-5 w-3/4 bg-carbon-600" />
          <div className="h-2 w-full bg-carbon-600" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-carbon-600" />
            <div className="h-3 w-5/6 bg-carbon-600" />
            <div className="h-3 w-4/6 bg-carbon-600" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Loading;
