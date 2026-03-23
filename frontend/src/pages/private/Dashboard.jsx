import { useState } from "react";
import { Header } from "../../components/dashboard/Header.jsx";
import { AccountSidebar } from "../../components/dashboard/AccountSidebar.jsx";
import { StatsCard } from "../../components/dashboard/StatsCard.jsx";
import { TransactionsTable } from "../../components/dashboard/TransactionsTable.jsx";
import { USER, ACCOUNTS, ALL_TRANSACTIONS, PAGE_SIZE } from "../../constants/dashboardData.js";

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
            <StatsCard active={active} user={USER} totalCredit={totalCredit} totalDebit={totalDebit} />

            {/* Transactions card */}
            <TransactionsTable 
              paginated={paginated} 
              filtered={filtered} 
              active={active} 
              page={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </main>
        </div>
      </div>
    </>
  );
}