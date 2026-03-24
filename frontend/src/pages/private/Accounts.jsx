import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import AccountsTable from "../../components/account/AccountsTable.jsx";
import AccountCreateModal from "../../components/account/AccountCreateModal.jsx";
import AccountEditModal from "../../components/account/AccountEditModal.jsx";

export default function Accounts() {
  const { accounts, refreshAccounts } = useOutletContext();
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEditAccount = async (account) => {
    setSelectedAccount(account);
    setIsEditingModalOpen(true);
  };

  const handleDeleteAccount = async (account) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/accounts/${account.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        refreshAccounts();
        return;
      } 
      
      setErrorMessage("La suppression du compte a echouée. Reessayez.");
    } 
    catch (error) {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        setErrorMessage(apiMessage || "Erreur serveur, impossible de se connecter au compte.");
      } 
      else {
        setErrorMessage("Une erreur inattendue est survenue.");
      }
    }
  };

  const handleCreateAccount = () => {
    setIsCreationModalOpen(true);
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <AccountsTable
        accounts={accounts}
        onEditAccount={handleEditAccount}
        onDeleteAccount={handleDeleteAccount}
      />
      <button
        onClick={ handleCreateAccount }
        className="self-start mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-400 transition-colors"
      >
        Ajouter un compte
      </button>

      { errorMessage && (
        <div className="text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <AccountCreateModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onAccountCreated={refreshAccounts}
      />

      <AccountEditModal
        isOpen={isEditingModalOpen}
        account={selectedAccount}
        onClose={() => {
          setIsEditingModalOpen(false);
          setSelectedAccount(null);
        }}
        onAccountEdited={refreshAccounts}
      />
    </main>
  );
}
