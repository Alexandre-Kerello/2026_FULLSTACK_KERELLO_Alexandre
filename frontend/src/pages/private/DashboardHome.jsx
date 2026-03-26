import { useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { StatsCard } from "../../components/dashboard/StatsCard.jsx";
import { TransactionsTable } from "../../components/dashboard/TransactionsTable.jsx";
import { TransactionModal } from "../../components/dashboard/TransactionModal.jsx";

export default function DashboardHome() {
  const {
    accounts,
    transactions,
    pageSize,
    selectedAccount,
    page,
    onPageChange,
    refreshAccounts,
    refreshTransactions,
  } = useOutletContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  function extractId(value) {
    if (!value) return "";
    if (typeof value === "object") {
      return value._id || value.id || "";
    }
    return value;
  }

  const filtered = selectedAccount
    ? transactions.filter((t) => String(extractId(t.accountId)) === String(selectedAccount))
    : transactions;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalCredit = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebit = Math.abs(filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const active = selectedAccount ? accounts.find(a => a.id === selectedAccount) : null;

  function handleEdit(tx) {
    setTransactionToEdit(tx);
    setIsEditModalOpen(true);
  }

  async function handleDelete(transactionId) {
    if (!transactionId) return;

    const confirmed = window.confirm("Supprimer cette transaction ?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Promise.all([refreshAccounts(), refreshTransactions()]);
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <StatsCard active={active} accounts={accounts} totalCredit={totalCredit} totalDebit={totalDebit} />
      <TransactionsTable 
        paginated={paginated} 
        filtered={filtered} 
        active={active} 
        page={page} 
        totalPages={totalPages} 
        onPageChange={onPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTransactionToEdit(null);
        }}
        accounts={accounts}
        selectedAccountId={extractId(transactionToEdit?.accountId) || selectedAccount}
        transactionToEdit={transactionToEdit}
        onTransactionSaved={async () => {
          await Promise.all([refreshAccounts(), refreshTransactions()]);
        }}
      />
    </main>
  );
}
