import userModel from './user.model.js';

export async function isUserAlreadyExists(email) {
    const user = await userModel.findOne({ email });
    return !!user;
}