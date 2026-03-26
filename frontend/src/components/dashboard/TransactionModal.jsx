import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CATEGORY_ICON } from "../../constants/dashboardData.js";

export function TransactionModal({
  isOpen,
  onClose,
  accounts,
  selectedAccountId,
  onCreateTransaction,
  transactionToEdit = null,
  onTransactionSaved,
}) {
  const isEditMode = Boolean(transactionToEdit);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const [currenciesError, setCurrenciesError] = useState("");
  const [formData, setFormData] = useState({
    accountId: selectedAccountId || (accounts[0]?.id || null),
    label: "",
    categoryId: "",
    currencyId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const modalRef = useRef(null);

  function extractId(value) {
    if (!value) return "";
    if (typeof value === "object") {
      return value._id || value.id || "";
    }
    return value;
  }

  useEffect(() => {
    async function loadCurrencies() {
      setIsLoadingCurrencies(true);
      setCurrenciesError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/currencies", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const normalizedCurrencies = (response.data || [])
          .map((currency) => ({
            id: currency._id || currency.id,
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
          }))
          .filter((currency) => currency.id && currency.code);

        setCurrencies(normalizedCurrencies);
        setFormData((prev) => ({
          ...prev,
          currencyId: prev.currencyId || normalizedCurrencies[0]?.id || "",
        }));
      } catch {
        setCurrenciesError("Impossible de charger les monnaies.");
      } finally {
        setIsLoadingCurrencies(false);
      }
    }

    async function loadCategories() {
      setIsLoadingCategories(true);
      setCategoriesError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const normalizedCategories = (response.data || []).map((category) => ({
          id: category._id || category.id,
          name: category.name,
        })).filter((category) => category.id && category.name);

        setCategories(normalizedCategories);
        setFormData((prev) => ({
          ...prev,
          categoryId: prev.categoryId || normalizedCategories[0]?.id || "",
        }));
      } catch {
        setCategoriesError("Impossible de charger les categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    if (isOpen) {
      loadCurrencies();
      loadCategories();
    }
  }, [isOpen]);


  // Mettre à jour le compte sélectionné chaque fois qu'il change
  useEffect(() => {
    if (!isOpen || !isEditMode || !transactionToEdit) {
      return;
    }

    const normalizedDate = transactionToEdit.date
      ? new Date(transactionToEdit.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      accountId: extractId(transactionToEdit.accountId) || prev.accountId,
      label: transactionToEdit.label || "",
      categoryId: extractId(transactionToEdit.categoryId) || prev.categoryId,
      currencyId: extractId(transactionToEdit.currencyId) || prev.currencyId,
      amount: Number(transactionToEdit.amount ?? 0),
      date: normalizedDate,
    }));
  }, [isOpen, isEditMode, transactionToEdit]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      accountId: selectedAccountId || (accounts[0]?.id || null),
    }));

    const selectedAccount = accounts.find((acc) => acc.id === (selectedAccountId || accounts[0]?.id));
    if (!selectedAccount || currencies.length === 0) return;

    const accountCurrency = selectedAccount.currency;
    const matchedCurrency = currencies.find((currency) =>
      currency.id === accountCurrency || currency.code === accountCurrency
    );

    if (matchedCurrency) {
      setFormData((prev) => ({
        ...prev,
        currencyId: matchedCurrency.id,
      }));
    }
  }, [selectedAccountId, accounts, currencies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find((category) => category.id === formData.categoryId);
    console.log("Nouvelle transaction:", {
      ...formData,
      icon: CATEGORY_ICON[selectedCategory?.name] || "🏷️",
    });

    try {
      const token = localStorage.getItem("token");
      const payload = {
        accountId: formData.accountId,
        label: formData.label,
        amount: formData.amount,
        type: formData.amount >= 0 ? "credit" : "debit",
        currencyId: formData.currencyId,
        categoryId: formData.categoryId,
        date: formData.date,
      };

      if (isEditMode) {
        const transactionId = transactionToEdit?._id || transactionToEdit?.id;
        await axios.put(`http://localhost:3000/api/transactions/${transactionId}`, payload, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      } else {
        await axios.post("http://localhost:3000/api/transactions", payload, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      }

      if (onTransactionSaved) {
        await onTransactionSaved();
      } else if (onCreateTransaction) {
        await onCreateTransaction();
      }

      onClose();

      if (!isEditMode) {
        setFormData({
          accountId: selectedAccountId || (accounts[0]?.id || null),
          label: "",
          categoryId: categories[0]?.id || "",
          currencyId: currencies[0]?.id || "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-96 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditMode ? "Modifier l'operation" : "Nouvelle operation"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Compte */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Compte
            </label>
            <select
              name="accountId"
              required
              value={formData.accountId || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="label"
              required
              value={formData.label}
              onChange={handleChange}
              placeholder="ex: Depense alimentation"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Catégorie
            </label>
            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoadingCategories || categories.length === 0}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {isLoadingCategories && <option value="">Chargement des categories...</option>}
              {!isLoadingCategories && categories.length === 0 && <option value="">Aucune categorie</option>}
              {!isLoadingCategories && categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {CATEGORY_ICON[cat.name] || "🏷️"} {cat.name}
                </option>
              ))}
            </select>
            {categoriesError && (
              <p className="mt-1 text-xs text-rose-600">{categoriesError}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Monnaie
            </label>
            <select
              name="currencyId"
              required
              value={formData.currencyId}
              onChange={handleChange}
              disabled={isLoadingCurrencies || currencies.length === 0}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {isLoadingCurrencies && <option value="">Chargement des monnaies...</option>}
              {!isLoadingCurrencies && currencies.length === 0 && <option value="">Aucune monnaie</option>}
              {!isLoadingCurrencies && currencies.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.code} - {currency.name} {currency.symbol}
                </option>
              ))}
            </select>
            {currenciesError && (
              <p className="mt-1 text-xs text-rose-600">{currenciesError}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Montant
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Positif = revenu, Négatif = dépense
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-400 transition-colors"
            >
              {isEditMode ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
