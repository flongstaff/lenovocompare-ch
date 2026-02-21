const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-carbon-600 h-8 w-48 rounded" />
    <div className="carbon-card p-6">
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-carbon-600 h-4 rounded" style={{ width: `${90 - i * 5}%` }} />
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
