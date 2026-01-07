const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response.util');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.param,
            message: error.msg
        }));

        return errorResponse(res, 'Validation failed', 400, errorMessages);
    }

    next();
};

module.exports = validate;
