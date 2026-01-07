// Success response
exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Error response
exports.errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

// Paginated response
exports.paginatedResponse = (res, data, page, limit, totalCount, message = 'Success') => {
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total_count: totalCount,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
        }
    });
};
