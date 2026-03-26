import { log } from "node:console";
import logger from "../../utils/logger.js";
import accountsService from "./accounts.service.js";

async function getAccounts(req, res, next) 
{
    try {
        const userId = req.user.id;

        const accounts = await accountsService.getAccountsByUserId(userId);
        res.status(200).json(accounts);
    } catch (error) {
        logger.error(`Error fetching accounts: ${error.message}`);
        next(error);
    }
}

async function createAccount(req, res, next)
{
    try {
        const userId = req.user.id;
        const name = req.body.name;
        const type = req.body.type;
        const balance = req.body.balance;
        const currency = req.body.currency;
        if (!name || !type || balance === undefined || !currency) {
            logger.warn('Missing required fields for account creation');
            return res.status(400).json({ message: 'Name, type, balance, and currency are required' });
        }

        const account = await accountsService.createAccount({ userId, name, type, balance, currency });
        res.status(201).json(account);
    } 
    catch (error) {
        logger.error(`Error creating account: ${error.message}`);
        next(error);
    }
}

async function getAccount(req, res, next) 
{
    try {
        const { id } = req.params;

        const account = await accountsService.getAccountById(id);
        if (!account) {
            logger.warn(`Account ${id} not found`);
            res.status(404).json({ message: `Account  ${id} not found`});
        }
        res.status(200).json(account);
    } 
    catch (error) {
        logger.error(`Error getting account ${id}: ${error.message}`);
        next(error);
    }
}

async function updateAccount(req, res, next) 
{
    try {
        const { id } = req.params;
        const currentAccount = await accountsService.getAccountById(id);
        if (!currentAccount) {
            logger.warn(`Account ${id} not found for update`);
            return res.status(404).json({ message: `Account ${id} not found` });
        }

        const name = req.body.name || currentAccount.name;
        const type = req.body.type || currentAccount.type;
        const balance = req.body.balance || currentAccount.balance;
        const currency = req.body.currency || currentAccount.currency;

        const updatedAccount = await accountsService.updateAccount({ accountId: id, name, type, balance, currency });
        if (!updatedAccount) {
            logger.error(`Failed to update account ${id}`);
            res.status(500).json({ message: `Failed to update account ${id}` });
        }
        logger.info(`Account ${id} updated successfully`);
        res.status(200).json(updatedAccount);
    }
    catch (error) {
        logger.error(`Error updating account ${id}: ${error.message}`);
        next(error);
    }
}

async function deleteAccount(req, res, next)
{
    try {
        const { id } = req.params;
        const deletedAccount = await accountsService.deleteAccount(id);
        if (!deletedAccount) {
            logger.warn(`Account ${id} not found for deletion`);
            res.status(404).json({ message: `Account ${id} not found` });
        }
        logger.info(`Account ${id} deleted successfully`);
        res.status(200).json({ message: `Account ${id} deleted successfully` });
    }
    catch (error) {
        logger.error(`Error deleting account ${id}: ${error.message}`);
        next(error);
    }
}

export default {
    getAccounts,
    createAccount,
    getAccount,
    updateAccount,
    deleteAccount,
}