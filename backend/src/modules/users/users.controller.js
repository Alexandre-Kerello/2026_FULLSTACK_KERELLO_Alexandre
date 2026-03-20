import logger from "../../utils/logger.js";
import usersService from "./users.service.js";

async function getUserById(req, res, next)
{
    try {
        const { id } = req.params;
        
        const user = await usersService.getUserById(id);
        if (!user) {
            logger.warn(`User with ID ${id} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } 
    catch (error) {
        logger.error(`Error fetching user by ID: ${error.message}`);
        next(error);
    }
}

async function updateUser(req, res, next) 
{
    try {
        const { id } = req.params;
        const updateData = req.body;

        await usersService.updateUser(id, updateData);
        res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        next(error);
    }
}

async function deleteUser(req, res, next) 
{
    try {
        const { id } = req.params;
        await usersService.deleteUser(id);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        next(error);
    }
}

export default {
    getUserById,
    updateUser,
    deleteUser
};