import logger from '../../utils/logger.js';
import transactionsService from './transactions.service.js';

async function getAllTransactions(req, res) {
    try {
        const userId = req.user.id;
        const transactions = await transactionsService.getAllTransactions(userId);
        res.status(200).json(transactions);
    } 
    catch (error) {
        logger.error('Error fetching transactions:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getTransactionById(req, res) {
    try {
        const { id } = req.params;
        const transaction = await transactionsService.getTransactionById(id);
        res.status(200).json(transaction);
    } 
    catch (error) {
        logger.error('Error fetching transaction:', error);
        res.status(500).json({ message: error.message });
    }
}

async function createTransaction(req, res) {
    try {
        const accountId = req.body.accountId;
        const label = req.body.label;
        const amount = req.body.amount;
        const type = req.body.type;
        const currencyId = req.body.currencyId;
        const categoryId = req.body.categoryId;
        const date = req.body.date;

        const isAmountMissing = amount === undefined || amount === null || Number.isNaN(Number(amount));

        if (!accountId || !label || isAmountMissing || !type || !currencyId || !date) {
            logger.info(`Missing required fields: ${!accountId ? 'accountId ' : ''}${!label ? 'label ' : ''}${isAmountMissing ? 'amount ' : ''}${!type ? 'type ' : ''}${!currencyId ? 'currencyId ' : ''}${!date ? 'date ' : ''}`);
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const transaction = await transactionsService.createTransaction(accountId, label, amount, type, currencyId, categoryId, date);
        logger.info('Transaction created successfully');
        res.status(201).json(transaction);
    }
    catch (error) {
        logger.error('Error creating transaction:', error);
        res.status(500).json({ message: error.message });
    }
}

async function updateTransaction(req, res) {
    try {
        const { id } = req.params;

        const previousTransaction = await transactionsService.getTransactionById(id);
        if (!previousTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const accountId = req.body.accountId ?? previousTransaction.accountId;
        const label = req.body.label ?? previousTransaction.label;
        const amount = req.body.amount ?? previousTransaction.amount;
        const type = req.body.type ?? previousTransaction.type;
        const currencyId = req.body.currencyId ?? previousTransaction.currencyId;
        const categoryId = req.body.categoryId ?? previousTransaction.categoryId;
        const date = req.body.date ?? previousTransaction.date;

        const transaction = await transactionsService.updateTransaction(id, accountId, label, amount, type, currencyId, categoryId, date);
        logger.info(`Transaction ${id} updated successfully`);
        res.status(200).json(transaction);
    }
    catch (error) {
        logger.error('Error updating transaction:', error);
        res.status(500).json({ message: error.message });
    }
}

async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        const transaction = await transactionsService.deleteTransaction(id);
        logger.info(`Transaction ${id} deleted successfully`);
        res.status(200).json(transaction);
    }
    catch (error) {
        logger.error('Error deleting transaction:', error);
        res.status(500).json({ message: error.message });
    }
}

export default {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
}