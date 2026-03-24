import { useOutletContext } from "react-router-dom";

export default function Accounts() {
  const { accounts } = useOutletContext();

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12M8 7a2 2 0 11-4 0m4 0a2 2 0 00-4 0m0 0H4m16 0h4m-4 7h4m-4 0a2 2 0 110-4m-4 4a2 2 0 110-4m0 4h-2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Comptes</h2>
        <p className="text-slate-500 text-center max-w-md">
          Gérez vos virements entre comptes et effectuez des transferts sécurisés.
        </p>
        <button className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors">
          Effectuer un virement
        </button>
      </div>
    </main>
  );
}
