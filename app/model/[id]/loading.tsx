const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-64 rounded bg-carbon-600" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="carbon-card space-y-4 p-6">
        <div className="h-5 w-32 rounded bg-carbon-600" />
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-4 rounded bg-carbon-600" style={{ width: `${80 - i * 10}%` }} />
          ))}
        </div>
      </div>
      <div className="carbon-card space-y-4 p-6">
        <div className="h-5 w-32 rounded bg-carbon-600" />
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-4 rounded bg-carbon-600" style={{ width: `${70 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Loading;
