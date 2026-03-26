import { fmt } from "../../utils/dashboardUtils.js";
import { TYPE_LABELS } from "../../constants/dashboardData.js";

export function StatsCard({ active, accounts, totalCredit, totalDebit }) {
  const totalBalance = (accounts || []).reduce((sum, account) => sum + Number(account.balance || 0), 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Balance */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm">
        <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.12em] mb-2">
          {active ? active.name : "Solde global"}
        </p>
        <p className="text-2xl font-extrabold text-white tabular-nums">
          {fmt(active ? active.balance : totalBalance)}
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-1 font-mono">
          {active ? TYPE_LABELS[active.type] : `${accounts?.length || 0} comptes actifs`}
        </p>
      </div>

      {/* Credits */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Crédits</p>
        </div>
        <p className="text-xl font-extrabold text-emerald-600 tabular-nums">{fmt(totalCredit)}</p>
      </div>

      {/* Debits */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Débits</p>
        </div>
        <p className="text-xl font-extrabold text-slate-700 tabular-nums">{fmt(totalDebit)}</p>
      </div>
    </div>
  );
}
