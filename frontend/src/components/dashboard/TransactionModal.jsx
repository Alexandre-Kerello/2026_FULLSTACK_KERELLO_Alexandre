import { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CATEGORIES = [
  "Alimentation", "Loisirs", "Logement", "Transport", "Santé",
  "Shopping", "Revenus", "Épargne", "Assurance", "Virement"
];

const CATEGORY_ICONS = {
  "Alimentation": "🛒",
  "Loisirs": "🎬",
  "Logement": "🏠",
  "Transport": "🚂",
  "Santé": "💊",
  "Shopping": "📦",
  "Revenus": "💼",
  "Épargne": "🏦",
  "Assurance": "🛡️",
  "Virement": "↩️",
};

export function TransactionModal({ isOpen, onClose, accounts, selectedAccountId, onCreateTransaction }) {
  const [formData, setFormData] = useState({
    accountId: selectedAccountId || (accounts[0]?.id || null),
    label: "",
    category: "Alimentation",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const modalRef = useRef(null);

  // Mettre à jour le compte sélectionné chaque fois qu'il change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      accountId: selectedAccountId || (accounts[0]?.id || null),
    }));
  }, [selectedAccountId, accounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label.trim() || formData.amount === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }
    console.log("Nouvelle transaction:", {
      ...formData,
      icon: CATEGORY_ICONS[formData.category],
    });
    // Ici tu peux ajouter l'appel API pour créer la transaction
    onCreateTransaction();
    onClose();
    setFormData({
      accountId: selectedAccountId || (accounts[0]?.id || null),
      label: "",
      category: "Alimentation",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
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
          <h2 className="text-lg font-bold text-slate-900">Nouvelle opération</h2>
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
              value={formData.label}
              onChange={handleChange}
              placeholder="ex: Dépense alimentation"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </option>
              ))}
            </select>
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
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2.5 text-slate-500 text-sm font-medium">€</span>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
