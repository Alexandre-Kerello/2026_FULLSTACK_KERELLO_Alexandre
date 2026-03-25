import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Parameters() {
  const { user } = useOutletContext();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    setFormData({
      firstname: user?.firstName || user?.firstname || "",
      lastname: user?.lastName || user?.lastname || "",
      email: user?.email || "",
    });
  }, [user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    try {
      setIsSavingProfile(true);
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profil mis à jour avec succès.");
    }
    catch {
      alert("Une erreur est survenue lors de la mise à jour de votre profil. Veuillez réessayer.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    try {
      setIsSavingPassword(true);
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/users/${user.id}/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Mot de passe modifié avec succès.");
      setIsPasswordModalOpen(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du changement de mot de passe.";
      alert(message);
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-10 gap-4 items-center justify-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Paramètres</h2>

        <form className="space-y-6" onSubmit={handleProfileSubmit}>
          {/* Profil */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Nom</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Sécurité */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Sécurité</h3>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              Changer le mot de passe
            </button>
          </div>

          <hr className="border-slate-200" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {isSavingProfile ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  firstname: user?.firstName || user?.firstname || "",
                  lastname: user?.lastName || user?.lastname || "",
                  email: user?.email || "",
                });
              }}
              className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">Changer le mot de passe</h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Ancien mot de passe</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {isSavingPassword ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
