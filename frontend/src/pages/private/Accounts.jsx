import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AccountsTable from "../../components/account/AccountsTable.jsx";
import { AccountModal } from "../../components/account/AccountModal.jsx";

export default function Accounts() {
  const { accounts } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditAccount = (account) => {
    console.log("Edit account:", account.id, account.name);
  };

  const handleDeleteAccount = (account) => {
    console.log("Delete account:", account.id, account.name);
  };

  const handleCreateAccount = () => {
    console.log("Create new account");
    setIsModalOpen(true);
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
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
