import express from 'express';
import accountsController from './accounts.controller.js';
import authenticateUser from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(authenticateUser, accountsController.getAccounts)
    .post(authenticateUser, accountsController.createAccount);

router.route('/:id')
  .get(authenticateUser, accountsController.getAccount)
  .put(authenticateUser, accountsController.updateAccount)
  .delete(authenticateUser, accountsController.deleteAccount);

export default router;