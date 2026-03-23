function PageBtn({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-base font-medium"
    >
      {children}
    </button>
  );
}

export function Pagination({ current, total, count, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === total || Math.abs(p - current) <= 1);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
      <p className="text-xs text-slate-400 tabular-nums">
        {count} opération{count > 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-1">
        <PageBtn disabled={current === 1} onClick={() => onChange(current - 1)}>‹</PageBtn>
        {visible.map((p, i) => {
          const prev = visible[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && (
                <span className="w-8 text-center text-xs text-slate-300">…</span>
              )}
              <button
                onClick={() => onChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors border ${
                  p === current
                    ? "bg-slate-800 text-white border-slate-700"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}
        <PageBtn disabled={current === total} onClick={() => onChange(current + 1)}>›</PageBtn>
      </div>
    </div>
  );
}
