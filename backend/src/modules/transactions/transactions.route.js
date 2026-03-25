import express from 'express';
import authenticateUser from '../../middlewares/auth.middleware.js';
import transactionsController from './transactions.controller.js';

const router = express.Router();

router.route('/')
    .get(authenticateUser, transactionsController.getAllTransactions)
    .post(authenticateUser,transactionsController.createTransaction);

router.route('/:id')
    .get(authenticateUser, transactionsController.getTransactionById)
    .put(authenticateUser, transactionsController.updateTransaction)
    .delete(authenticateUser, transactionsController.deleteTransaction);

export default router;