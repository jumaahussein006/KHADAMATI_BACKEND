const { errorResponse } = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return errorResponse(res, 'Validation error', 400, errors);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return errorResponse(res, 'Duplicate entry. Record already exists.', 400);
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return errorResponse(res, 'Invalid reference. Related record not found.', 400);
    }

    // Sequelize database error
    if (err.name === 'SequelizeDatabaseError') {
        return errorResponse(res, 'Database error occurred.', 500);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token.', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired.', 401);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return errorResponse(res, message, statusCode);
};

module.exports = errorMiddleware;
