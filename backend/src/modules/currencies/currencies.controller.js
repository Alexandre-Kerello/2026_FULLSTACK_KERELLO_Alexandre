import logger from "../../utils/logger.js";
import currenciesService from "./currencies.service.js";

async function getAllCurrencies(req, res, next) {
    try {
        const currencies = await currenciesService.getAllCurrencies();
        res.json(currencies);
    }
    catch (error) {
        logger.error(`Error fetching currencies: ${error.message}`);
        next(error);
    }
}

async function getCurrencyById(req, res, next) {
    try {
        const currency = await currenciesService.getCurrencyById(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        res.json(currency);
    }
    catch (error) {
        logger.error(`Error fetching currency: ${error.message}`);
        next(error);
    }
}

export default {
    getAllCurrencies,
    getCurrencyById
};