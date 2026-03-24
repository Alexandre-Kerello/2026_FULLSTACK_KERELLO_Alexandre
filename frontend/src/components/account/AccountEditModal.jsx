import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CURRENCIES_ID = {
    EUR: "69bd18c9d177f9dff28563b1",
    USD: "69bd18c9d177f9dff28563b2",
    GBP: "69bd18c9d177f9dff28563b3"
}

export default function AccountEditModal({
  isOpen,
  account,
  onClose,
  onAccountEdited = async () => {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "checking",
    balance: 0.00,
    currency: "EUR"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    if (!account) return;

    setFormData({
      name: account.name || "",
      type: account.type || "checking",
      balance: Number(account.balance ?? 0),
      currency: account.currency || "EUR",
    });
  }, [account, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!account?.id) {
      setErrorMessage("Aucun compte selectionne pour la modification.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      balance: Number(formData.balance),
      currency: CURRENCIES_ID[formData.currency],
    };

    try {
        const response = await axios.put(
            `http://localhost:3000/api/accounts/${account.id}`,
            payload,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        if (response.status === 200) {
          await onAccountEdited(response.data);
            onClose();
            return; 
        }

        setErrorMessage("La modification du compte a echouee. Reessayez.");
    } 
    catch (error) {
        if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        setErrorMessage(apiMessage || "Erreur serveur, impossible de se connecter au compte.");
        } else {
        setErrorMessage("Une erreur inattendue est survenue.");
        }
    } 
    finally {
        setIsSubmitting(false);
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
            <h2 className="text-lg font-bold text-slate-900">Modifier le compte</h2>
            <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nom */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom
                </label>
                <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })) }}
                placeholder="ex: Compte courant"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type
                </label>
                <select
                name="type"
                required
                value={formData.type}
                onChange={(e) => { setFormData(prev => ({ ...prev, type: e.target.value })) }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                <option value="checking">Compte courant</option>
                <option value="savings">Compte d'épargne</option>
                <option value="credit">Carte de crédit</option>
                <option value="investment">Compte d'investissement</option>
                </select>
            </div>

            {/* Solde initial */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                Solde initial
                </label>
                <div className="relative">
                <input
                    type="number"
                    name="balance"
                    required
                    value={formData.balance}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, balance: e.target.value }));
                    }}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                </div>
            </div>

            {/* Devise */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Devise
              </label>
              <select
                name="currency"
                required
                value={formData.currency}
                onChange={(e) => { setFormData(prev => ({ ...prev, currency: e.target.value })) }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
                <option value="GBP">Livre (£)</option>
              </select>
            </div>

            { errorMessage && (
              <div className="text-sm text-red-600">
                {errorMessage}
              </div>
            )}

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
                    {isSubmitting ? "Modification..." : "Enregistrer"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
