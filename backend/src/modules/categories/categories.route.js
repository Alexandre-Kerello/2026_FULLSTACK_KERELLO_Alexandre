import express from "express";
import categoriesController from "./categories.controller.js";

const router = express.Router();

router.route('/')
    .get(categoriesController.getAllCategories);

router.route('/:id')
    .get(categoriesController.getCategoryById);

export default router;