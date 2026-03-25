import transactionModel from './transactions.model.js';
import accountService from '../accounts/accounts.service.js';
import accountModel from '../accounts/accounts.model.js';
import logger from '../../utils/logger.js';

async function incrementAccountBalance(accountId, amountDelta) {
    if (!accountId || !amountDelta) {
        return;
    }

    const updatedAccount = await accountModel.findByIdAndUpdate(
        accountId,
        { $inc: { balance: amountDelta } },
        { new: true }
    );

    if (!updatedAccount) {
        throw new Error(`Account ${accountId} not found`);
    }
}

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
        const parsedAmount = Number(amount);
        const transaction = new transactionModel({
            accountId,
            label,
            amount: parsedAmount,
            type,
            currencyId,
            categoryId,
            date
        });

        const savedTransaction = await transaction.save();
        await incrementAccountBalance(accountId, parsedAmount);

        return savedTransaction;
    }
    catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
}

async function updateTransaction(id, accountId, label, amount, type, currencyId, categoryId, date) {
    try {
        const previousTransaction = await transactionModel.findById(id);
        if (!previousTransaction) {
            return null;
        }

        const parsedAmount = Number(amount);
        const previousAmount = Number(previousTransaction.amount);
        const previousAccountId = String(previousTransaction.accountId);
        const nextAccountId = String(accountId);

        if (previousAccountId === nextAccountId) {
            const delta = parsedAmount - previousAmount;
            await incrementAccountBalance(accountId, delta);
        } else {
            await incrementAccountBalance(previousTransaction.accountId, -previousAmount);
            await incrementAccountBalance(accountId, parsedAmount);
        }

        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            id,
            { accountId, label, amount: parsedAmount, type, currencyId, categoryId, date },
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
        const transaction = await transactionModel.findById(id);
        if (!transaction) {
            return null;
        }

        await incrementAccountBalance(transaction.accountId, -Number(transaction.amount));

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