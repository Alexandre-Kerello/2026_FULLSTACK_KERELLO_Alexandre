import logger from "../../utils/logger.js";
import categoriesService from "./categories.service.js";

async function getAllCategories(req, res) {
    try {
        const categories = await categoriesService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        logger.error(`Error fetching categories: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}

async function getCategoryById(req, res) {
    try {
        const category = await categoriesService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        logger.error(`Error fetching category: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}

export default {
    getAllCategories,
    getCategoryById
};