import { useEffect, useState } from "react";
import axios from "axios";
import { fmt, fmtDate } from "../../utils/dashboardUtils.js";
import { CATEGORY_ICON } from "../../constants/dashboardData.js";

export function TransactionRow({ tx, onEdit, onDelete }) {
  const isPositive = tx.amount > 0;
  const [categoryName, setCategoryName] = useState("Chargement...");
  const [currencyCode, setCurrencyCode] = useState("EUR");

  function getSafeCurrencyCode(code) {
    return /^[A-Z]{3}$/.test(code || "") ? code : "EUR";
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCategoryName() {
      const rawCategory = tx.categoryId;

      if (!rawCategory) {
        if (isMounted) setCategoryName("Sans catégorie");
        return;
      }

      if (typeof rawCategory === "object" && rawCategory.name) {
        if (isMounted) setCategoryName(rawCategory.name);
        return;
      }

      const categoryId = typeof rawCategory === "object"
        ? rawCategory._id || rawCategory.id
        : rawCategory;

      if (!categoryId) {
        if (isMounted) setCategoryName("Sans catégorie");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/categories/${categoryId}`);
        const name = response.data?.name || "Catégorie inconnue";
        if (isMounted) setCategoryName(name);
      } catch (error) {
        console.log(`Error fetching category for ID ${categoryId}:`, error);
        if (isMounted) setCategoryName("Catégorie inconnue");
      }
    }

    fetchCategoryName();

    return () => {
      isMounted = false;
    };
  }, [tx.categoryId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrencyCode() {
      const rawCurrency = tx.currencyId;

      if (!rawCurrency) {
        if (isMounted) setCurrencyCode("EUR");
        return;
      }

      if (typeof rawCurrency === "object" && rawCurrency.code) {
        if (isMounted) setCurrencyCode(rawCurrency.code);
        return;
      }

      const currencyId = typeof rawCurrency === "object"
        ? rawCurrency._id || rawCurrency.id
        : rawCurrency;

      if (!currencyId) {
        if (isMounted) setCurrencyCode("EUR");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/currencies/${currencyId}`);
        const code = response.data?.code;
        if (isMounted) setCurrencyCode(getSafeCurrencyCode(code));
      } catch (error) {
        console.log(`Error fetching currency for ID ${currencyId}:`, error);
        if (isMounted) setCurrencyCode("EUR");
      }
    }

    fetchCurrencyCode();

    return () => {
      isMounted = false;
    };
  }, [tx.currencyId]);



  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <td className="py-3 pl-5 pr-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white border border-transparent group-hover:border-slate-200 flex items-center justify-center text-lg transition-all shadow-none group-hover:shadow-sm">
          {CATEGORY_ICON[categoryName]}
        </div>
      </td>
      <td className="py-3 px-3">
        <p className="text-sm font-semibold text-slate-800">{tx.label}</p>
        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
          {categoryName}
        </span>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell text-sm text-slate-400 tabular-nums whitespace-nowrap">
        {fmtDate(tx.date)}
      </td>
      <td className="py-3 pl-3 pr-5 text-right">
        <p className={`text-sm font-bold tabular-nums ${isPositive ? "text-emerald-600" : "text-slate-700"}`}>
          {isPositive ? "+" : ""}{fmt(tx.amount, getSafeCurrencyCode(currencyCode))}
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
            onClick={() => onDelete(tx.id || tx._id)}
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
