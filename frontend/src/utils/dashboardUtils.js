// ── Utils & Formatting ────────────────────────────────────────────────────────
export function fmt(n, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
