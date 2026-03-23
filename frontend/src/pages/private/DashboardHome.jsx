import { useOutletContext } from "react-router-dom";
import { StatsCard } from "../../components/dashboard/StatsCard.jsx";
import { TransactionsTable } from "../../components/dashboard/TransactionsTable.jsx";

export default function DashboardHome() {
  const {
    user,
    accounts,
    transactions,
    pageSize,
    selectedAccount,
    onSelectAccount,
    page,
    onPageChange,
  } = useOutletContext();

  const filtered = selectedAccount
    ? transactions.filter(t => t.accountId === selectedAccount)
    : transactions;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalCredit = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebit = Math.abs(filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const active = selectedAccount ? accounts.find(a => a.id === selectedAccount) : null;

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <StatsCard active={active} user={user} totalCredit={totalCredit} totalDebit={totalDebit} />
      <TransactionsTable 
        paginated={paginated} 
        filtered={filtered} 
        active={active} 
        page={page} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </main>
  );
}
