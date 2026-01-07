const { Payment, ServiceRequest, Service, Customer, Provider, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

const VALID_PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

const USER_SAFE_ATTRS = ['userId', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'role', 'createdAt'];

// Get all payments (admin only)
exports.getAllPayments = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return errorResponse(res, 'Unauthorized.', 403);

        const payments = await Payment.findAll({
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    include: [
                        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                        { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                        { model: Service, as: 'service' },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, payments, 'Payments retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get payments for customer
exports.getMyPayments = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ where: { userId: req.user.userId } });
        if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

        const payments = await Payment.findAll({
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    where: { customerId: customer.customerId },
                    include: [
                        { model: Service, as: 'service' },
                        { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, payments, 'Payments retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get payments for provider
exports.getProviderPayments = async (req, res, next) => {
    try {
        const provider = await Provider.findOne({ where: { userId: req.user.userId } });
        if (!provider) return errorResponse(res, 'Provider profile not found.', 404);

        const payments = await Payment.findAll({
            include: [
                {
                    model: ServiceRequest,
                    as: 'request',
                    where: { providerId: provider.providerId },
                    include: [
                        { model: Service, as: 'service' },
                        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, payments, 'Payments retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Create payment (provider for own request OR admin)
exports.createPayment = async (req, res, next) => {
    try {
        const { request_id, amount, method, status } = req.body;

        if (!request_id || amount === undefined) {
            return errorResponse(res, 'request_id and amount are required.', 400);
        }

        const request = await ServiceRequest.findByPk(request_id);
        if (!request) return errorResponse(res, 'Service request not found.', 404);

        if (req.user.role === 'provider') {
            const provider = await Provider.findOne({ where: { userId: req.user.userId } });
            if (!provider || request.providerId !== provider.providerId) return errorResponse(res, 'Unauthorized.', 403);
        } else if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized.', 403);
        }

        const finalStatus = status || 'pending';
        if (!VALID_PAYMENT_STATUSES.includes(finalStatus)) {
            return errorResponse(res, 'Invalid payment status.', 400);
        }

        const payment = await Payment.create({
            requestId: request_id,
            amount,
            method: method || 'cash',
            status: finalStatus,
            transactionDate: null,
            getawayResponse: null,
            createdAt: new Date(),
        });

        return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
        return next(error);
    }
};

// Update payment (admin only)
exports.updatePayment = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return errorResponse(res, 'Unauthorized.', 403);

        const { id } = req.params;
        const { amount, method, status, transaction_date, getaway_response } = req.body;

        const payment = await Payment.findByPk(id);
        if (!payment) return errorResponse(res, 'Payment not found.', 404);

        const updates = {};
        if (amount !== undefined) updates.amount = amount;
        if (method !== undefined) updates.method = method;

        if (status !== undefined) {
            if (!VALID_PAYMENT_STATUSES.includes(status)) return errorResponse(res, 'Invalid payment status.', 400);
            updates.status = status;
        }

        if (transaction_date !== undefined) updates.transactionDate = transaction_date;
        if (getaway_response !== undefined) updates.getawayResponse = getaway_response;

        await payment.update(updates);

        return successResponse(res, payment, 'Payment updated successfully');
    } catch (error) {
        return next(error);
    }
};

// Delete payment (admin only)
exports.deletePayment = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return errorResponse(res, 'Unauthorized.', 403);

        const { id } = req.params;

        const payment = await Payment.findByPk(id);
        if (!payment) return errorResponse(res, 'Payment not found.', 404);

        await payment.destroy();
        return successResponse(res, null, 'Payment deleted successfully');
    } catch (error) {
        return next(error);
    }
};
