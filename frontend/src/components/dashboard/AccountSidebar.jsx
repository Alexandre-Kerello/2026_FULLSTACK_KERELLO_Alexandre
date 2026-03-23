import { fmt } from "../../utils/dashboardUtils.js";
import { COLOR_MAP, TYPE_ICON } from "../../constants/dashboardData.js";

export function AccountSidebar({ accounts, selected, onSelect }) {
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <aside className="w-96 flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] px-1 pb-1">
          Mes comptes
        </p>

        {/* All accounts */}
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left rounded-xl border px-3 py-3 transition-all duration-150 ${
            selected === null
              ? "bg-slate-800 border-slate-700 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${selected === null ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"}`}>
              ✦
            </div>
            <div>
              <p className={`text-sm font-semibold ${selected === null ? "text-white" : "text-slate-700"}`}>
                Tous les comptes
              </p>
              <p className={`text-xs tabular-nums font-medium ${selected === null ? "text-slate-400" : "text-slate-400"}`}>
                {fmt(total)}
              </p>
            </div>
          </div>
        </button>

        <hr className="border-slate-200 my-0.5" />

        {/* Individual accounts */}
        {accounts.map(acc => {
          const c = COLOR_MAP[acc.color];
          const isActive = selected === acc.id;
          return (
            <button
              key={acc.id}
              onClick={() => onSelect(acc.id)}
              className={`w-full text-left rounded-xl border px-3 py-3 transition-all duration-150 ${
                isActive
                  ? `${c.activeBg} ${c.activeBorder} shadow-sm`
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${isActive ? c.iconBg : "bg-slate-100"} transition-colors`}>
                  <span className={isActive ? c.iconText : "text-slate-500"}>
                    {TYPE_ICON[acc.type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? c.activeText : "text-slate-700"}`}>
                    {acc.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">{acc.number}</p>
                </div>
              </div>
              <p className={`text-[15px] font-bold tabular-nums mt-2 ${isActive ? c.activeText : "text-slate-800"}`}>
                {fmt(acc.balance)}
              </p>
            </button>
          );
        })}

        <div className="flex-1" />

        {/* CTA */}
        <button className="w-full mt-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau virement
        </button>
      </div>
    </aside>
  );
}
