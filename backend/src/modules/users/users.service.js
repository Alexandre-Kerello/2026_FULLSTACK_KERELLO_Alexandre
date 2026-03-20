import userModel from './users.model.js';

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
    await userModel.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteUser(id)
{
    await userModel.findByIdAndDelete(id);
}

export default {
    isUserAlreadyExists,
    getUserById,
    updateUser,
    deleteUser
};