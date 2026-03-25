import currencyModel from "./currencies.model.js";

async function getAllCurrencies() {
    try {
        return await currencyModel.find();
    }
    catch (error) {
        throw new Error(`Error fetching currencies: ${error.message}`);
    }
}

async function getCurrencyById(id) {
    try {
        return await currencyModel.findById(id);
    }
    catch (error) {
        throw new Error(`Error fetching currency: ${error.message}`);
    }
}

export default {
    getAllCurrencies,
    getCurrencyById
};