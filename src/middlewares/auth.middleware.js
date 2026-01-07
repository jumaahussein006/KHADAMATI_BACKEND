const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { errorResponse } = require('../utils/response.util');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'khadamati-secret-key-2024'
        );

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return errorResponse(res, 'Invalid token. User not found.', 401);
        }

        // keep both to avoid breaking existing controllers
        req.user = {
            id: user.userId,
            userId: user.userId,
            role: user.role,
            email: user.email,
        };

        return next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token.', 401);
    }
};

module.exports = authMiddleware;
