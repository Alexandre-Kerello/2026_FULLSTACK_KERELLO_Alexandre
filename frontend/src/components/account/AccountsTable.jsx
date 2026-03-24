import { fmt } from "../../utils/dashboardUtils.js";
import { TYPE_ICON } from "../../constants/dashboardData.js";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AccountsTable({
    accounts,
    onEditAccount = () => {},
    onDeleteAccount = () => {},
}) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Comptes</h3>
            <table className="w-full table-fixed divide-y divide-slate-200">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="w-24"></th>
                        <th className="w-2/6 px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                        <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Solde</th>
                        <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monnaie</th>
                        <th className="w-1/6 px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td className="px-4 py-4 text-sm items-center justify-center flex">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 transition-colors">
                                    <span className="text-slate-500">
                                    {TYPE_ICON[account.type]}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-slate-900 truncate">{account.name}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{account.type}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{fmt(account.balance)}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{account.currency}</td>
                            <td className="px-4 py-4 text-sm text-slate-500 align-middle">
                                <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => onEditAccount(account)}
                                    className="text-indigo-500 hover:text-indigo-900 transition-colors"
                                >
                                    <PencilSquareIcon className="size-6" />
                                </button>
                                <div className="w-px h-6 bg-slate-400" />
                                <button
                                    onClick={() => onDeleteAccount(account)}
                                    className="text-red-500 hover:text-red-900 transition-colors"
                                >
                                    <TrashIcon className="size-6" />
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}