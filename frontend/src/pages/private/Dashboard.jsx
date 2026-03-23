import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const USER = {
  name: "Alexandre",
  email: "alexandre@email.com",
  avatar: "A",
  totalBalance: 24831.42,
};

const ACCOUNTS = [
  { id: 1, name: "Compte Courant", number: "**** 4821", balance: 3412.80,  type: "checking", color: "emerald" },
  { id: 2, name: "Livret A",        number: "**** 2047", balance: 8200.00,  type: "savings",  color: "blue"    },
  { id: 3, name: "Compte Épargne",  number: "**** 9913", balance: 12118.62, type: "savings",  color: "amber"   },
  { id: 4, name: "Carte Prépayée",  number: "**** 3356", balance: 1100.00,  type: "prepaid",  color: "rose"    },
];

const ALL_TRANSACTIONS = [
  { id:  1, accountId: 1, label: "Netflix",              category: "Loisirs",      date: "2026-03-20", amount: -15.99,   icon: "🎬" },
  { id:  2, accountId: 1, label: "Virement Salaire",     category: "Revenus",      date: "2026-03-18", amount: 2800.00,  icon: "💼" },
  { id:  3, accountId: 1, label: "Carrefour",            category: "Alimentation", date: "2026-03-17", amount: -67.43,   icon: "🛒" },
  { id:  4, accountId: 1, label: "EDF Électricité",      category: "Logement",     date: "2026-03-15", amount: -84.20,   icon: "⚡" },
  { id:  5, accountId: 2, label: "Virement épargne",     category: "Épargne",      date: "2026-03-14", amount: 500.00,   icon: "🏦" },
  { id:  6, accountId: 1, label: "Spotify",              category: "Loisirs",      date: "2026-03-13", amount: -9.99,    icon: "🎵" },
  { id:  7, accountId: 3, label: "Intérêts",             category: "Revenus",      date: "2026-03-12", amount: 24.30,    icon: "📈" },
  { id:  8, accountId: 1, label: "SNCF Billet",          category: "Transport",    date: "2026-03-11", amount: -43.00,   icon: "🚂" },
  { id:  9, accountId: 4, label: "Rechargement carte",   category: "Virement",     date: "2026-03-10", amount: 200.00,   icon: "💳" },
  { id: 10, accountId: 1, label: "Loyer Mars",           category: "Logement",     date: "2026-03-05", amount: -900.00,  icon: "🏠" },
  { id: 11, accountId: 2, label: "Retrait épargne",      category: "Virement",     date: "2026-03-03", amount: -300.00,  icon: "↩️" },
  { id: 12, accountId: 1, label: "Pharmacie",            category: "Santé",        date: "2026-03-02", amount: -28.50,   icon: "💊" },
  { id: 13, accountId: 3, label: "Assurance vie",        category: "Assurance",    date: "2026-02-28", amount: -55.00,   icon: "🛡️" },
  { id: 14, accountId: 1, label: "Restaurant Chez Paul", category: "Alimentation", date: "2026-02-27", amount: -38.00,   icon: "🍽️" },
  { id: 15, accountId: 1, label: "Amazon",               category: "Shopping",     date: "2026-02-25", amount: -124.99,  icon: "📦" },
  { id: 16, accountId: 4, label: "Uber Eats",            category: "Alimentation", date: "2026-02-24", amount: -22.80,   icon: "🛵" },
  { id: 17, accountId: 2, label: "Versement mensuel",    category: "Épargne",      date: "2026-02-20", amount: 400.00,   icon: "🏦" },
  { id: 18, accountId: 1, label: "Mutuelle santé",       category: "Assurance",    date: "2026-02-18", amount: -42.00,   icon: "❤️" },
  { id: 19, accountId: 1, label: "Prime annuelle",       category: "Revenus",      date: "2026-02-15", amount: 1500.00,  icon: "🎁" },
  { id: 20, accountId: 3, label: "Dividendes",           category: "Revenus",      date: "2026-02-10", amount: 180.00,   icon: "📊" },
];

// ── Constants & Config ───────────────────────────────────────────────────────
const PAGE_SIZE = 8;

const COLOR_MAP = {
  emerald: {
    activeBorder: "border-emerald-300",
    activeBg:     "bg-emerald-50",
    activeText:   "text-emerald-700",
    iconBg:       "bg-emerald-100",
    iconText:     "text-emerald-600",
    dot:          "bg-emerald-400",
  },
  blue: {
    activeBorder: "border-blue-300",
    activeBg:     "bg-blue-50",
    activeText:   "text-blue-700",
    iconBg:       "bg-blue-100",
    iconText:     "text-blue-600",
    dot:          "bg-blue-400",
  },
  amber: {
    activeBorder: "border-amber-300",
    activeBg:     "bg-amber-50",
    activeText:   "text-amber-700",
    iconBg:       "bg-amber-100",
    iconText:     "text-amber-600",
    dot:          "bg-amber-400",
  },
  rose: {
    activeBorder: "border-rose-300",
    activeBg:     "bg-rose-50",
    activeText:   "text-rose-700",
    iconBg:       "bg-rose-100",
    iconText:     "text-rose-600",
    dot:          "bg-rose-400",
  },
};

const TYPE_ICON = { checking: "◈", savings: "◉", prepaid: "◌" };

// ── Utils & Subcomponents ─────────────────────────────────────────────────
function fmt(n) 
{
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function fmtDate(d) 
{
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function Header({ user }) 
{
  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
          V
        </div>
        <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">
          vault<span className="text-emerald-500">.</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-0.5 ml-5">
        {["Dashboard", "Virements", "Analyses", "Paramètres"].map(item => (
          <button
            key={item}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              item === "Dashboard"
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Bell */}
      <button className="relative w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-[7px] right-[7px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      </button>

      <div className="w-px h-6 bg-slate-200" />

      {/* User badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
          {user.avatar}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
          <p className="text-xs text-slate-400 tabular-nums leading-tight">{fmt(user.totalBalance)}</p>
        </div>
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}

function AccountSidebar({ accounts, selected, onSelect }) 
{
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

function TransactionRow({ tx, onEdit, onDelete }) 
{
  const isPositive = tx.amount > 0;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <td className="py-3 pl-5 pr-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white border border-transparent group-hover:border-slate-200 flex items-center justify-center text-lg transition-all shadow-none group-hover:shadow-sm">
          {tx.icon}
        </div>
      </td>
      <td className="py-3 px-3">
        <p className="text-sm font-semibold text-slate-800">{tx.label}</p>
        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
          {tx.category}
        </span>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell text-sm text-slate-400 tabular-nums whitespace-nowrap">
        {fmtDate(tx.date)}
      </td>
      <td className="py-3 pl-3 pr-5 text-right">
        <p className={`text-sm font-bold tabular-nums ${isPositive ? "text-emerald-600" : "text-slate-700"}`}>
          {isPositive ? "+" : ""}{fmt(tx.amount)}
        </p>
        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
          isPositive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
        }`}>
          {isPositive ? "Crédit" : "Débit"}
        </span>
      </td>
      {/* Actions — visibles au hover */}
      <td className="py-3 pr-4 w-20">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit */}
          <button
            onClick={() => onEdit(tx)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-400 hover:text-blue-500 flex items-center justify-center transition-colors shadow-xs"
            title="Modifier"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(tx.id)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs"
            title="Supprimer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

function Pagination({ current, total, count, onChange }) 
{
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

function PageBtn({ disabled, onClick, children }) 
{
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


// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);

  const filtered    = selectedAccount
    ? ALL_TRANSACTIONS.filter(t => t.accountId === selectedAccount)
    : ALL_TRANSACTIONS;
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalCredit = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebit  = Math.abs(filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const active      = selectedAccount ? ACCOUNTS.find(a => a.id === selectedAccount) : null;

  function handleSelect(id) { setSelectedAccount(id); setPage(1); }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <div className="min-h-screen bg-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <Header user={USER} />

        <div className="flex overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
          <AccountSidebar accounts={ACCOUNTS} selected={selectedAccount} onSelect={handleSelect} />

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Balance */}
              <div className="bg-slate-800 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2">
                  {active ? active.name : "Solde global"}
                </p>
                <p className="text-2xl font-extrabold text-white tabular-nums">
                  {fmt(active ? active.balance : USER.totalBalance)}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {active ? active.number : `${ACCOUNTS.length} comptes actifs`}
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">Crédits</p>
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">Débits</p>
                </div>
                <p className="text-xl font-extrabold text-slate-700 tabular-nums">{fmt(totalDebit)}</p>
              </div>
            </div>

            {/* Transactions card */}
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

              <Pagination current={page} total={totalPages} count={filtered.length} onChange={setPage} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}