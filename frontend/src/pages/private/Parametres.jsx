import { useOutletContext } from "react-router-dom";

export default function Parametres() {
  const { user } = useOutletContext();

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Paramètres</h2>

        <div className="space-y-6">
          {/* Profil */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Nom complet</label>
                <input type="text" placeholder={user.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                <input type="email" placeholder={user.email} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Sécurité */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Sécurité</h3>
            <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors">
              Changer le mot de passe
            </button>
          </div>

          <hr className="border-slate-200" />

          {/* Actions */}
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors">
              Enregistrer
            </button>
            <button className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
