import transactionModel from './transactions.model.js';
import accountService from '../accounts/accounts.service.js';
import logger from '../../utils/logger.js';

async function getAllTransactions(userId) {
    try {
        const accountsResult = await accountService.getAccountsByUserId(userId);
        const accounts = Array.isArray(accountsResult)
            ? accountsResult
            : Array.isArray(accountsResult?.accounts)
                ? accountsResult.accounts
                : [];

        logger.info(`Found ${accounts.length} accounts for user ${userId}`);

        const accountIds = accounts
            .map((account) => account?._id ?? account?.id)
            .filter(Boolean);

        if (accountIds.length === 0) {
            logger.info(`No valid account IDs found for user ${userId}`);
            return [];
        }

        logger.info(`Account IDs extracted for user ${userId}: ${accountIds.join(', ')}`);
        const transactions = await transactionModel.find({ accountId: { $in: accountIds } });
        
        return transactions;

    }
    catch (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
}

async function getTransactionById(id) {
    try {
        const transaction = await transactionModel.findById(id);
        return transaction;
    }
    catch (error) {
        throw new Error(`Error fetching transaction: ${error.message}`);
    }
}

async function createTransaction(accountId, label, amount, type, currencyId, categoryId, date) {
    try {
        const transaction = new transactionModel({
            accountId,
            label,
            amount,
            type,
            currencyId,
            categoryId,
            date
        });
        return await transaction.save();
    }
    catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
}

async function updateTransaction(id, accountId, label, amount, type, currencyId, categoryId, date) {
    try {
        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            id,
            { accountId, label, amount, type, currencyId, categoryId, date },
            { new: true }
        );
        return updatedTransaction;
    }
    catch (error) {
        throw new Error(`Error updating transaction: ${error.message}`);
    }
}

async function deleteTransaction(id) {
    try {
        const deletedTransaction = await transactionModel.findByIdAndDelete(id);
        return deletedTransaction;
    }
    catch (error) {
        throw new Error(`Error deleting transaction: ${error.message}`);
    }
}

export default {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
}