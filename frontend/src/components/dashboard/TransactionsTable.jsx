import { TransactionRow } from "./TransactionRow.jsx";
import { Pagination } from "./Pagination.jsx";
import { COLOR_MAP } from "../../constants/dashboardData.js";

export function TransactionsTable({ paginated, filtered, active, page, totalPages, onPageChange }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800">
            Transactions
            {active && (
              <span className={`ml-2 font-semibold text-sm ${COLOR_MAP[active.color].activeText}`}>
                — {active.name}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} opération{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtrer
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-2 pl-5 pr-3 w-16" />
              <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Libellé</th>
              <th className="py-2 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] hidden sm:table-cell">Date</th>
              <th className="py-2 pl-3 pr-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Montant</th>
              <th className="py-2 pr-4 w-20" />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-sm text-slate-400">
                  Aucune transaction pour ce compte.
                </td>
              </tr>
            ) : paginated.map(tx => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                onEdit={(tx) => console.log("Modifier", tx)}
                onDelete={(id) => console.log("Supprimer", id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} count={filtered.length} onChange={onPageChange} />
    </div>
  );
}
