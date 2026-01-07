const { Review, ServiceRequest, Service, Customer, Provider, User, Category } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

const USER_SAFE_ATTRS = ['userId', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'role', 'createdAt'];

const normalizeIds = (body) => {
    const requestId = body.requestId ?? body.requestid ?? body.request_id ?? null;
    return { requestId };
};

// Get reviews by service (public)
// Since review table only links to request, we filter by joining ServiceRequest -> Service
exports.getReviewsByService = async (req, res, next) => {
    try {
        const { serviceId } = req.params;

        const reviews = await Review.findAll({
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    required: true,
                    where: { serviceId },
                    include: [
                        {
                            model: Service,
                            as: 'service',
                            include: [{ model: Category, as: 'category' }],
                        },
                        {
                            model: Customer,
                            as: 'customer',
                            include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                        },
                        {
                            model: Provider,
                            as: 'provider',
                            include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get reviews by provider (public)
exports.getReviewsByProvider = async (req, res, next) => {
    try {
        const { providerId } = req.params;

        const reviews = await Review.findAll({
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    required: true,
                    where: { providerId },
                    include: [
                        { model: Service, as: 'service' },
                        {
                            model: Customer,
                            as: 'customer',
                            include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                        },
                        {
                            model: Provider,
                            as: 'provider',
                            include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Create review (customer only)
exports.createReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { requestId } = normalizeIds(req.body);

        if (!requestId) return errorResponse(res, 'request_id is required.', 400);
        if (rating === undefined) return errorResponse(res, 'rating is required.', 400);

        const customer = await Customer.findOne({ where: { userId: req.user.userId } });
        if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

        const request = await ServiceRequest.findByPk(requestId);
        if (!request) return errorResponse(res, 'Service request not found.', 404);

        if (request.customerId !== customer.customerId) {
            return errorResponse(res, 'Unauthorized. This request does not belong to you.', 403);
        }

        if (request.status !== 'completed') {
            return errorResponse(res, 'You can only review a completed request.', 400);
        }

        // Prevent duplicate review per request
        const existing = await Review.findOne({ where: { requestId } });
        if (existing) return errorResponse(res, 'You already reviewed this request.', 409);

        const review = await Review.create({
            requestId,
            rating,
            comment: comment || null,
            createdAt: new Date(),
        });

        const created = await Review.findByPk(review.reviewId, {
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    include: [
                        { model: Service, as: 'service' },
                        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                        { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                    ],
                },
            ],
        });

        return successResponse(res, created, 'Review created successfully', 201);
    } catch (error) {
        return next(error);
    }
};

// Update review (customer only)
// Ownership is derived from review.request.customerId (since review has no customerId column)
exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findByPk(reviewId);
        if (!review) return errorResponse(res, 'Review not found.', 404);

        const customer = await Customer.findOne({ where: { userId: req.user.userId } });
        if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

        const request = await ServiceRequest.findByPk(review.requestId);
        if (!request) return errorResponse(res, 'Service request not found.', 404);

        if (request.customerId !== customer.customerId) {
            return errorResponse(res, 'Unauthorized to update this review.', 403);
        }

        const updates = {};
        if (rating !== undefined) updates.rating = rating;
        if (comment !== undefined) updates.comment = comment;

        await review.update(updates);

        return successResponse(res, review, 'Review updated successfully');
    } catch (error) {
        return next(error);
    }
};

// Delete review (customer or admin)
exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);
        if (!review) return errorResponse(res, 'Review not found.', 404);

        if (req.user.role !== 'admin') {
            const customer = await Customer.findOne({ where: { userId: req.user.userId } });
            if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

            const request = await ServiceRequest.findByPk(review.requestId);
            if (!request) return errorResponse(res, 'Service request not found.', 404);

            if (request.customerId !== customer.customerId) {
                return errorResponse(res, 'Unauthorized to delete this review.', 403);
            }
        }

        await review.destroy();
        return successResponse(res, null, 'Review deleted successfully');
    } catch (error) {
        return next(error);
    }
};
