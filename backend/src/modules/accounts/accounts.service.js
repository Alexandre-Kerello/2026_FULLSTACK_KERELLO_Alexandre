import accountModel from "./accounts.model.js";    

async function getAccountsByUserId(id)
{
    try {
        const accounts = await accountModel.find({ userId: id }).populate('currency', 'code name');
        return accounts;
    } 
    catch (error) {
        throw new Error(`Error fetching accounts for user ${id}: ${error.message}`);
    }
}

async function createAccount(accountData)
{
    try {
        const account = new accountModel(accountData);
        await account.save();
        return account;
    } 
    catch (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
}

async function getAccountById(id) 
{
    try {
        const account = await accountModel.findById(id);
        return account;
    }
    catch (error)
    {
        throw new Error(`Error getting account ${id}: ${error.message}`);
    }
}

async function updateAccount({ accountId, name, type, balance, currency }) {
    try {
        const updatedAccount = await accountModel.findByIdAndUpdate(
            accountId,
            { name, type, balance, currency },
            { new: true }
        );
        return updatedAccount;
    } 
    catch (error) {
        throw new Error(`Error updating account ${accountId}: ${error.message}`);
    }
}

async function deleteAccount(id) 
{
    try {
        const deletedAccount = await accountModel.findByIdAndDelete(id);
        return deletedAccount;
    }
    catch (error) {
        throw new Error(`Error deleting account ${id}: ${error.message}`);
    }
}

export default {
    getAccountsByUserId,
    createAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
}