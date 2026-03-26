import { userInfo } from 'os';
import logger from '../../utils/logger.js';
import authService from './auth.service.js';

async function register(req, res, next) {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { user } = await authService.createUser({ firstname, lastname, email, password });

        logger.info(`New user registered: ${email}`);
        return res.status(201).json({
            message: 'Account successfully created',
            userId: user._id
        });
    }
    catch (error) {
        logger.error(`Registration error: ${error.message}`);
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const { token, user } = await authService.loginUser({ email, password });
        if (!user) {
            logger.warn(`Failed login attempt for email: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        logger.info(`User logged in: ${email}`);
        return res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            token,
        });
    }
    catch (error) {
        logger.error(`Login error: ${error.message}`);
        next(error);
    }
}

export default {
    register,
    login
};