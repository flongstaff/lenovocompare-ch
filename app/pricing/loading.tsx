const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-carbon-600 h-8 w-40 rounded" />
    <div className="carbon-card space-y-3 p-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="bg-carbon-600 h-4 rounded" style={{ width: `${95 - i * 3}%` }} />
      ))}
    </div>
  </div>
);

export default Loading;
