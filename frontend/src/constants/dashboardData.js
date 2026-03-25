// ── Constants & Config ───────────────────────────────────────────────────────
export const PAGE_SIZE = 8;

export const COLOR_MAP = {
  emerald: {
    activeBorder: "border-emerald-300",
    activeBg:     "bg-emerald-50",
    activeText:   "text-emerald-700",
    iconBg:       "bg-emerald-100",
    iconText:     "text-emerald-600",
    dot:          "bg-emerald-400",
  },
  blue: {
    activeBorder: "border-blue-300",
    activeBg:     "bg-blue-50",
    activeText:   "text-blue-700",
    iconBg:       "bg-blue-100",
    iconText:     "text-blue-600",
    dot:          "bg-blue-400",
  },
  amber: {
    activeBorder: "border-amber-300",
    activeBg:     "bg-amber-50",
    activeText:   "text-amber-700",
    iconBg:       "bg-amber-100",
    iconText:     "text-amber-600",
    dot:          "bg-amber-400",
  },
  rose: {
    activeBorder: "border-rose-300",
    activeBg:     "bg-rose-50",
    activeText:   "text-rose-700",
    iconBg:       "bg-rose-100",
    iconText:     "text-rose-600",
    dot:          "bg-rose-400",
  },
};

export const TYPE_ICON = { 
  checking: "◈", 
  savings: "◉", 
  prepaid: "◌" 
};

export const CATEGORY_ICON = {
  "Loisirs": "🎬",
  "Alimentation": "🛒",
  "Loyer": "🏠",
  "Transport": "🚗",
  "Santé": "❤️",
  "Revenus": "💰",
  "Épargne": "🏦",
  "Assurance": "🛡️",
  "Shopping": "🛍️",
  "Virement": "🔄",
  "Autre": "❓",
};

export const TYPE_LABELS = {
  checking: "Compte courant",
  savings: "Compte épargne",
  credit: "Carte de crédit",
  investment: "Investissement",
};