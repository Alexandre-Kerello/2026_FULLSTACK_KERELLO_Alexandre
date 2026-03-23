// ── Mock Data ──────────────────────────────────────────────────────────────────
export const USER = {
  "firstName": "Alexandre",
  "lastName": "Kerello",
  "email": "alexandre@email.com",
  "avatar": "A",
  "totalBalance": 24831.42,
};

export const ACCOUNTS = [
  { "id": 1, "name": "Compte Courant", "number": "**** 4821", "balance": 3412.80,  "type": "checking", "color": "emerald" },
  { "id": 2, "name": "Livret A",        "number": "**** 2047", "balance": 8200.00,  "type": "savings",  "color": "blue"    },
  { "id": 3, "name": "Compte Épargne",  "number": "**** 9913", "balance": 12118.62, "type": "savings",  "color": "amber"   },
  { "id": 4, "name": "Carte Prépayée",  "number": "**** 3356", "balance": 1100.00,  "type": "prepaid",  "color": "rose"    },
];

export const ALL_TRANSACTIONS = [
  { id:  1, accountId: 1, label: "Netflix",              category: "Loisirs",      date: "2026-03-20", amount: -15.99,   icon: "🎬" },
  { id:  2, accountId: 1, label: "Virement Salaire",     category: "Revenus",      date: "2026-03-18", amount: 2800.00,  icon: "💼" },
  { id:  3, accountId: 1, label: "Carrefour",            category: "Alimentation", date: "2026-03-17", amount: -67.43,   icon: "🛒" },
  { id:  4, accountId: 1, label: "EDF Électricité",      category: "Logement",     date: "2026-03-15", amount: -84.20,   icon: "⚡" },
  { id:  5, accountId: 2, label: "Virement épargne",     category: "Épargne",      date: "2026-03-14", amount: 500.00,   icon: "🏦" },
  { id:  6, accountId: 1, label: "Spotify",              category: "Loisirs",      date: "2026-03-13", amount: -9.99,    icon: "🎵" },
  { id:  7, accountId: 3, label: "Intérêts",             category: "Revenus",      date: "2026-03-12", amount: 24.30,    icon: "📈" },
  { id:  8, accountId: 1, label: "SNCF Billet",          category: "Transport",    date: "2026-03-11", amount: -43.00,   icon: "🚂" },
  { id:  9, accountId: 4, label: "Rechargement carte",   category: "Virement",     date: "2026-03-10", amount: 200.00,   icon: "💳" },
  { id: 10, accountId: 1, label: "Loyer Mars",           category: "Logement",     date: "2026-03-05", amount: -900.00,  icon: "🏠" },
  { id: 11, accountId: 2, label: "Retrait épargne",      category: "Virement",     date: "2026-03-03", amount: -300.00,  icon: "↩️" },
  { id: 12, accountId: 1, label: "Pharmacie",            category: "Santé",        date: "2026-03-02", amount: -28.50,   icon: "💊" },
  { id: 13, accountId: 3, label: "Assurance vie",        category: "Assurance",    date: "2026-02-28", amount: -55.00,   icon: "🛡️" },
  { id: 14, accountId: 1, label: "Restaurant Chez Paul", category: "Alimentation", date: "2026-02-27", amount: -38.00,   icon: "🍽️" },
  { id: 15, accountId: 1, label: "Amazon",               category: "Shopping",     date: "2026-02-25", amount: -124.99,  icon: "📦" },
  { id: 16, accountId: 4, label: "Uber Eats",            category: "Alimentation", date: "2026-02-24", amount: -22.80,   icon: "🛵" },
  { id: 17, accountId: 2, label: "Versement mensuel",    category: "Épargne",      date: "2026-02-20", amount: 400.00,   icon: "🏦" },
  { id: 18, accountId: 1, label: "Mutuelle santé",       category: "Assurance",    date: "2026-02-18", amount: -42.00,   icon: "❤️" },
  { id: 19, accountId: 1, label: "Prime annuelle",       category: "Revenus",      date: "2026-02-15", amount: 1500.00,  icon: "🎁" },
  { id: 20, accountId: 3, label: "Dividendes",           category: "Revenus",      date: "2026-02-10", amount: 180.00,   icon: "📊" },
];

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

export const TYPE_ICON = { checking: "◈", savings: "◉", prepaid: "◌" };
