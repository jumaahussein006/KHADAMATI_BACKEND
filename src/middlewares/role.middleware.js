const { errorResponse } = require('../utils/response.util');

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Unauthorized. No user found.', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return errorResponse(res, 'Forbidden. Insufficient permissions.', 403);
        }

        return next();
    };
};

module.exports = requireRole;
