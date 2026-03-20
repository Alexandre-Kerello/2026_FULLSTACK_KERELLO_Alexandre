import express from 'express';
import usersController from './users.controller.js';
import authenticateUser from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/:id')
    .get(authenticateUser, usersController.getUserById)
    .put(authenticateUser, usersController.updateUser)
    .delete(authenticateUser, usersController.deleteUser);

export default router;