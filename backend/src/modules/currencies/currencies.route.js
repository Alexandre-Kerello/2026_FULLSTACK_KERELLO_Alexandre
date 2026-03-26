import express from "express";
import currenciesController from "./currencies.controller.js";

const router = express.Router();

router.route('/')
    .get(currenciesController.getAllCurrencies);

router.route('/:id')
    .get(currenciesController.getCurrencyById);

export default router;
