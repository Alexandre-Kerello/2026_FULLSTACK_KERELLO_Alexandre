import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/dashboard/Header.jsx";
import { AccountSidebar } from "../../components/dashboard/AccountSidebar.jsx";
import { PAGE_SIZE } from "../../constants/dashboardData.js";

export default function DashboardLayout() {
  const { id: userIdFromUrl } = useParams();
  const [user, setUser] = useState({
    id: userIdFromUrl || "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const loadAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setAccountsError("");

    const token = localStorage.getItem("token");
    if (!token) {
      logout();
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
  }, [logout]);

  const loadTransactions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
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
  }, [logout]);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !userIdFromUrl) {
      logout();
      setAccountsError("Session invalide. Merci de vous reconnecter.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userIdFromUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiUser = response.data || {};
      setUser({
        ...apiUser,
        id: apiUser._id || apiUser.id || userIdFromUrl,
        firstName: apiUser.firstName || apiUser.firstname || "",
        lastName: apiUser.lastName || apiUser.lastname || "",
        email: apiUser.email || "",
      });
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setAccountsError(apiMessage || "Impossible de charger votre profil utilisateur.");
      logout();
    }
  }, [logout, userIdFromUrl]);

  useEffect(() => {
    loadUser();
    loadAccounts();
    loadTransactions();
  }, [loadUser, loadAccounts, loadTransactions]);

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
    user,
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

        <Header user={user} currentPage={currentPage} onPageChange={() => {}} />

        <div className="flex overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
          {/* Afficher la sidebar seulement sur Dashboard */}
          {currentPage === "Dashboard" && (
            <AccountSidebar
              accounts={accounts}
              selected={selectedAccount}
              onSelect={handleSelect}
              onCreateTransaction={async () => {
                await Promise.all([loadAccounts(), loadTransactions()]);
              }}
            />
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