import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../users/users.model.js';
import logger from '../../utils/logger.js';
import userService from '../users/users.service.js';

async function checkUserPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

function signToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: `${process.env.JWT_EXPIRES_IN}` }
    );
}

async function createUser({ firstname, lastname, email, password }) {
    logger.info(`Attempting to register user with email: ${email}`);
    if (await userService.isUserAlreadyExists(email)) {
        logger.warn(`Attempt to register with existing email: ${email}`);
        const err = new Error('Email already in use');
        err.status = 400;
        throw err;
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new userModel({
        firstname,
        lastname,
        email,
        password: hashedPassword
    });
    await user.save();

    return { user };
}

async function loginUser({ email, password }) {
    if (await userService.isUserAlreadyExists(email) === false) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        const err = new Error('User not found');
        err.status = 401;
        throw err;
    }

    const user = await userModel.findOne({ email });

    const isMatch = await checkUserPassword(password, user.password);
    if (!isMatch) {
        logger.warn(`Invalid password attempt for email: ${email}`);
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    const token = signToken(user);
    return { token, user };
}

export default {
    createUser,
    loginUser
};