import express from 'express';
import usersController from './users.controller.js';

const router = express.Router();

router.route('/:id')
    .get(usersController.getUserById)
    .put(usersController.updateUser)
    .delete(usersController.deleteUser);

export default router;