import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fmt } from "../../utils/dashboardUtils.js";

const PIE_COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#64748b"];

function extractId(value) {
  if (!value) return "";
  if (typeof value === "object") return value._id || value.id || "";
  return value;
}

export default function Analyses() {
  const { transactions, accounts, selectedAccount } = useOutletContext();
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!isMounted) return;

        const map = (response.data || []).reduce((acc, category) => {
          const id = category._id || category.id;
          if (id) acc[id] = category.name;
          return acc;
        }, {});

        setCategoriesMap(map);
      } catch {
        if (isMounted) setCategoriesMap({});
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!selectedAccount) return transactions || [];
    return (transactions || []).filter((tx) => String(extractId(tx.accountId)) === String(selectedAccount));
  }, [transactions, selectedAccount]);

  const currentBalance = useMemo(() => {
    if (selectedAccount) {
      const account = (accounts || []).find((acc) => String(acc.id) === String(selectedAccount));
      return Number(account?.balance || 0);
    }
    return (accounts || []).reduce((sum, account) => sum + Number(account.balance || 0), 0);
  }, [accounts, selectedAccount]);

  const balanceHistoryData = useMemo(() => {
    if (!filteredTransactions.length) return [];

    const dailyChanges = filteredTransactions.reduce((acc, tx) => {
      const key = new Date(tx.date).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
      return acc;
    }, {});

    const sortedDays = Object.keys(dailyChanges).sort((a, b) => new Date(a) - new Date(b));
    const totalFlow = sortedDays.reduce((sum, day) => sum + dailyChanges[day], 0);
    let runningBalance = currentBalance - totalFlow;

    return sortedDays.map((day) => {
      runningBalance += dailyChanges[day];
      return {
        date: new Date(day).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        balance: Number(runningBalance.toFixed(2)),
      };
    });
  }, [filteredTransactions, currentBalance]);

  const expensesByCategory = useMemo(() => {
    const totals = filteredTransactions
      .filter((tx) => Number(tx.amount) < 0)
      .reduce((acc, tx) => {
        const categoryId = extractId(tx.categoryId);
        const categoryName = categoriesMap[categoryId] || (typeof tx.categoryId === "object" ? tx.categoryId.name : null) || "Sans catégorie";
        acc[categoryName] = (acc[categoryName] || 0) + Math.abs(Number(tx.amount || 0));
        return acc;
      }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categoriesMap]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Solde du compte dans le temps</h3>
            <p className="text-sm text-slate-500">{selectedAccount ? "Compte sélectionné" : "Tous les comptes"}</p>
          </div>

          {balanceHistoryData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Pas assez de transactions pour tracer l'évolution du solde.
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistoryData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} width={90} tickFormatter={(value) => fmt(value).replace(" €", "")} />
                  <Tooltip formatter={(value) => [fmt(value), "Solde"]} labelFormatter={(label) => `Date: ${label}`} />
                  <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Dépenses par catégorie</h3>
            <p className="text-sm text-slate-500">Répartition des montants sortants</p>
          </div>

          {expensesByCategory.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Aucune dépense disponible pour le camembert.
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    outerRadius={100}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [fmt(value), "Dépenses"]} />
                  <Legend verticalAlign="bottom" height={42} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
