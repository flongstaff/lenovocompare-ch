const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-40 bg-carbon-600" />
    <div className="carbon-card space-y-3 p-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-4 bg-carbon-600" style={{ width: `${95 - i * 3}%` }} />
      ))}
    </div>
  </div>
);

export default Loading;
