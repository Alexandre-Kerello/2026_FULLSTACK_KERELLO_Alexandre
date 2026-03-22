import logger from "../../utils/logger.js";
import accountsService from "./accounts.service.js";

async function getAccounts(req, res, next) 
{
    try {
        const userId = req.user.id;

        const accounts = await accountsService.getAccountsByUserId(userId);
        res.json(accounts);
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
    } catch (error) {
        logger.error(`Error creating account: ${error.message}`);
        next(error);
    }
}

export default {
    getAccounts,
    createAccount
}