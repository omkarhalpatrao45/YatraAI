function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-700">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600"
        aria-hidden="true"
      />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export default LoadingSpinner;

