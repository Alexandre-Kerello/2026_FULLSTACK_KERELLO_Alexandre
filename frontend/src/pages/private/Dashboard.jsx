import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../../components/dashboard/Header.jsx";
import { AccountSidebar } from "../../components/dashboard/AccountSidebar.jsx";
import { USER, ALL_TRANSACTIONS, PAGE_SIZE } from "../../constants/dashboardData.js";

export default function DashboardLayout() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);
  const location = useLocation();

  async function loadAccounts() {
    setIsLoadingAccounts(true);
    setAccountsError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setAccountsError("Session invalide. Merci de vous reconnecter.");
      setIsLoadingAccounts(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const colorCycle = ["emerald", "blue", "amber", "rose"];
      const normalizedAccounts = (response.data || []).map((account, index) => ({
        ...account,
        id: account._id,
        balance: Number(account.balance),
        color: account.color || colorCycle[index % colorCycle.length],
        currency:
          typeof account.currency === "object"
            ? account.currency.code
            : account.currency,
      }));

      setAccounts(normalizedAccounts);
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setAccountsError(apiMessage || "Impossible de charger vos comptes.");
    } finally {
      setIsLoadingAccounts(false);
    }
  }

  async function loadTransactions() {
    const token = localStorage.getItem("token");
    if (!token) {
      setAccountsError("Session invalide. Merci de vous reconnecter.");
      return;
    }

    try {
        const response = await axios.get("http://localhost:3000/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const transactions = response.data || [];
        setTransactions(transactions);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        setAccountsError(apiMessage || "Impossible de charger vos transactions.");
    }
  }

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  // Déterminer la page actuelle basée sur la route
  const getCurrentPage = () => {
    const pathname = location.pathname;
    if (pathname.includes("accounts")) return "Comptes";
    if (pathname.includes("analyses")) return "Analyses";
    if (pathname.includes("parameters")) return "Paramètres";
    return "Dashboard";
  };

  const currentPage = getCurrentPage();

  function handleSelect(id) { setSelectedAccount(id); setPage(1); }

  // Passer les données communes aux pages enfants
  const contextValue = {
    user: USER,
    accounts,
    transactions,
    pageSize: PAGE_SIZE,
    selectedAccount,
    onSelectAccount: handleSelect,
    page,
    onPageChange: setPage,
    refreshAccounts: loadAccounts,
    refreshTransactions: loadTransactions,
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100">

        <Header user={USER} currentPage={currentPage} onPageChange={() => {}} />

        <div className="flex overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
          {/* Afficher la sidebar seulement sur Dashboard */}
          {currentPage === "Dashboard" && (
            <AccountSidebar accounts={accounts} selected={selectedAccount} onSelect={handleSelect} onCreateTransaction={loadTransactions} />
          )}

          {/* Afficher la page enfant avec les données contextuelles */}
          {isLoadingAccounts ? (
            <main className="flex-1 p-6 text-slate-600">Chargement des comptes...</main>
          ) : accountsError ? (
            <main className="flex-1 p-6 text-red-600">{accountsError}</main>
          ) : (
            <Outlet context={contextValue} />
          )}
        </div>
      </div>
    </>
  );
}