import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

function authenticateUser(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        logger.warn('No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        logger.info(`Authenticated user: ${req.user.email}`);
        next();
    } 
    catch (error) {
        logger.error('Invalid token');
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

export default authenticateUser;