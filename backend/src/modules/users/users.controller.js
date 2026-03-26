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

        const updatedUser = await usersService.updateUser(id, updateData);
        res.json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        next(error);
    }
}

async function changePassword(req, res, next)
{
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        await usersService.changeUserPassword(id, oldPassword, newPassword);
        return res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        logger.error(`Error changing password: ${error.message}`);
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
    changePassword,
    deleteUser
};