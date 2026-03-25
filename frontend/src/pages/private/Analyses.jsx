import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

  const monthlyIncomeExpenseData = useMemo(() => {
    const totalsByMonth = filteredTransactions.reduce((acc, tx) => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[key]) {
        acc[key] = { monthKey: key, credits: 0, debits: 0 };
      }

      const amount = Number(tx.amount || 0);
      if (amount >= 0) {
        acc[key].credits += amount;
      } else {
        acc[key].debits += Math.abs(amount);
      }

      return acc;
    }, {});

    return Object.values(totalsByMonth)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map((row) => {
        const [year, month] = row.monthKey.split("-").map(Number);
        return {
          ...row,
          label: new Date(year, month - 1, 1).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
          credits: Number(row.credits.toFixed(2)),
          debits: Number(row.debits.toFixed(2)),
        };
      });
  }, [filteredTransactions]);

  const cumulativeNetSavingsData = useMemo(() => {
    let cumulative = 0;

    return monthlyIncomeExpenseData.map((row) => {
      cumulative += row.credits - row.debits;
      return {
        label: row.label,
        cumulative: Number(cumulative.toFixed(2)),
      };
    });
  }, [monthlyIncomeExpenseData]);

  const monthProjectionData = useMemo(() => {
    if (!filteredTransactions.length) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const thisMonthTransactions = filteredTransactions.filter((tx) => {
      const date = new Date(tx.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const dailyNet = thisMonthTransactions.reduce((acc, tx) => {
      const day = new Date(tx.date).getDate();
      acc[day] = (acc[day] || 0) + Number(tx.amount || 0);
      return acc;
    }, {});

    const netSoFar = Object.entries(dailyNet)
      .filter(([day]) => Number(day) <= currentDay)
      .reduce((sum, [, amount]) => sum + amount, 0);

    const avgDailyNet = currentDay > 0 ? netSoFar / currentDay : 0;

    let runningActual = 0;
    const actualByDay = {};
    for (let day = 1; day <= currentDay; day += 1) {
      runningActual += dailyNet[day] || 0;
      actualByDay[day] = Number(runningActual.toFixed(2));
    }

    const actualAtToday = actualByDay[currentDay] || 0;

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const projected = day >= currentDay
        ? Number((actualAtToday + avgDailyNet * (day - currentDay)).toFixed(2))
        : null;

      return {
        day,
        actual: day <= currentDay ? actualByDay[day] : null,
        projected,
      };
    });
  }, [filteredTransactions]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-6 gap-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Revenus vs dépenses par mois</h3>
            <p className="text-sm text-slate-500">Comparaison mensuelle des flux entrants et sortants</p>
          </div>

          {monthlyIncomeExpenseData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Pas assez de données pour ce graphique.
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncomeExpenseData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} width={90} tickFormatter={(value) => fmt(value).replace(" €", "")} />
                  <Tooltip
                    formatter={(value, _name, entry) => {
                      const label = entry?.dataKey === "credits" ? "Revenus" : "Dépenses";
                      return [fmt(value), label];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="credits" name="Revenus" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="debits" name="Dépenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Épargne nette cumulée</h3>
            <p className="text-sm text-slate-500">Somme cumulée de (revenus - dépenses)</p>
          </div>

          {cumulativeNetSavingsData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Pas assez de données pour ce graphique.
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeNetSavingsData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} width={90} tickFormatter={(value) => fmt(value).replace(" €", "")} />
                  <Tooltip formatter={(value) => [fmt(value), "Épargne nette"]} />
                  <Line type="monotone" dataKey="cumulative" name="Épargne cumulée" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Projection fin de mois</h3>
            <p className="text-sm text-slate-500">Trajectoire réelle puis projection à partir de la moyenne journalière du mois</p>
          </div>

          {monthProjectionData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Pas assez de données pour ce graphique.
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthProjectionData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} width={90} tickFormatter={(value) => fmt(value).replace(" €", "")} />
                  <Tooltip formatter={(value, key) => [fmt(value), key === "actual" ? "Cumul réel" : "Projection"]} labelFormatter={(value) => `Jour ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" name="Cumul réel" stroke="#0ea5e9" strokeWidth={3} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="projected" name="Projection" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" dot={false} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
