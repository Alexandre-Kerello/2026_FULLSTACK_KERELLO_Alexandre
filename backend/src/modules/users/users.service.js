import userModel from './users.model.js';
import bcrypt from 'bcrypt';

async function isUserAlreadyExists(email) 
{
    const user = await userModel.findOne({ email });
    return !!user;
}

async function getUserById(id) 
{
    return await userModel.findById(id);
}

async function updateUser(id, updateData)
{
    const sanitizedUpdateData = {
        firstname: updateData.firstname,
        lastname: updateData.lastname,
        email: updateData.email,
    };

    return await userModel.findByIdAndUpdate(id, sanitizedUpdateData, { new: true });
}

async function changeUserPassword(id, oldPassword, newPassword)
{
    const user = await userModel.findById(id);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        const err = new Error('Ancien mot de passe incorrect');
        err.status = 400;
        throw err;
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
}

async function deleteUser(id)
{
    await userModel.findByIdAndDelete(id);
}

export default {
    isUserAlreadyExists,
    getUserById,
    updateUser,
    changeUserPassword,
    deleteUser
};