import categoryModel from "./categories.model.js";

async function getAllCategories() {
    try {
        return await categoryModel.find();
    }
    catch (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
    }
}

async function getCategoryById(id) {
    try {
        return await categoryModel.findById(id);
    }
    catch (error) {
        throw new Error(`Error fetching category: ${error.message}`);
    }
}

export default {
    getAllCategories,
    getCategoryById
};