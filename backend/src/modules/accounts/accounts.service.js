import accountModel from "./accounts.model.js";    

async function getAccountsByUserId(id)
{
    try {
        const accounts = await accountModel.find({ userId: id }).populate('currency', 'code name');
        return accounts;
    } catch (error) {
        throw new Error(`Error fetching accounts for user ${id}: ${error.message}`);
    }
}

async function createAccount(accountData)
{
    try {
        const account = new accountModel(accountData);
        await account.save();
        return account;
    } catch (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
}

export default {
    getAccountsByUserId,
    createAccount
}