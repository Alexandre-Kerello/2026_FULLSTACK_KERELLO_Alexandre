import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../../components/dashboard/Header.jsx";
import { AccountSidebar } from "../../components/dashboard/AccountSidebar.jsx";
import { USER, ACCOUNTS, ALL_TRANSACTIONS, PAGE_SIZE } from "../../constants/dashboardData.js";

export default function DashboardLayout() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);
  const location = useLocation();

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
    accounts: ACCOUNTS,
    transactions: ALL_TRANSACTIONS,
    pageSize: PAGE_SIZE,
    selectedAccount,
    onSelectAccount: handleSelect,
    page,
    onPageChange: setPage,
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100">

        <Header user={USER} currentPage={currentPage} onPageChange={() => {}} />

        <div className="flex overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
          {/* Afficher la sidebar seulement sur Dashboard */}
          {currentPage === "Dashboard" && (
            <AccountSidebar accounts={ACCOUNTS} selected={selectedAccount} onSelect={handleSelect} />
          )}

          {/* Afficher la page enfant avec les données contextuelles */}
          <Outlet context={contextValue} />
        </div>
      </div>
    </>
  );
}