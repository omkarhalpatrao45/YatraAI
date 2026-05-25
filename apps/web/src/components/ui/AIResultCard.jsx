function AIResultCard({ result }) {
  if (!result) {
    return null;
  }

  const title = result?.title || 'Your AI itinerary';
  const summary = result?.summary || result?.itinerarySummary || result?.message;
  const itinerary = result?.itinerary || result?.plan;

  return (
    <article className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            AI generated
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">{title}</h2>
        </div>
        <div className="rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-semibold text-emerald-700">
          Ready
        </div>
      </div>

      {summary ? (
        <p className="mt-4 text-sm leading-7 text-zinc-700">{summary}</p>
      ) : null}

      {Array.isArray(itinerary) ? (
        <div className="mt-5 space-y-3">
          {itinerary.map((day, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-50 p-4">
              <p className="text-sm font-semibold text-zinc-900">
                Day {idx + 1}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {typeof day === 'string' ? day : day?.text || JSON.stringify(day)}
              </p>
            </div>
          ))}
        </div>
      ) : itinerary ? (
        <div className="mt-5 rounded-xl bg-zinc-50 p-4">
          <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
            {typeof itinerary === 'string'
              ? itinerary
              : JSON.stringify(itinerary, null, 2)}
          </pre>
        </div>
      ) : null}
    </article>
  );
}

export default AIResultCard;

