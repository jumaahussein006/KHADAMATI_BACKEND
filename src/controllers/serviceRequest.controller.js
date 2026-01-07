const {
    ServiceRequest,
    Service,
    Customer,
    Provider,
    User,
    Payment,
    StatusHistory,
    Category,
} = require('../models');

const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const USER_SAFE_ATTRS = ['userId', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'role', 'createdAt'];

const parsePagination = (page, limit) => {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;
    return { pageNum, limitNum, offset };
};

// Get my requests (customer)
exports.getMyRequests = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ where: { userId: req.user.userId } });
        if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

        const { page = 1, limit = 10, status } = req.query;
        const { pageNum, limitNum, offset } = parsePagination(page, limit);

        const where = { customerId: customer.customerId };
        if (status) where.status = status;

        const { count, rows } = await ServiceRequest.findAndCountAll({
            where,
            include: [
                {
                    model: Service,
                    as: 'service',
                    include: [{ model: Category, as: 'category' }],
                },
                {
                    model: Provider,
                    as: 'provider',
                    include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                },
            ],
            limit: limitNum,
            offset,
            order: [['requestDate', 'DESC']],
        });

        return paginatedResponse(res, rows, pageNum, limitNum, count, 'Requests retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get provider requests
exports.getProviderRequests = async (req, res, next) => {
    try {
        const provider = await Provider.findOne({ where: { userId: req.user.userId } });
        if (!provider) return errorResponse(res, 'Provider profile not found.', 404);

        const { page = 1, limit = 10, status } = req.query;
        const { pageNum, limitNum, offset } = parsePagination(page, limit);

        const where = { providerId: provider.providerId };
        if (status) where.status = status;

        const { count, rows } = await ServiceRequest.findAndCountAll({
            where,
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
                },
                { model: Service, as: 'service' },
            ],
            limit: limitNum,
            offset,
            order: [['requestDate', 'DESC']],
        });

        return paginatedResponse(res, rows, pageNum, limitNum, count, 'Provider requests retrieved successfully');
    } catch (error) {
        console.error('\n❌ ERROR in getProviderRequests:');
        console.error('Message:', error.message);
        console.error('SQL:', error.sql || 'N/A');
        console.error('Stack:', error.stack);
        return next(error);
    }
};

// Get all requests (role-aware: admin sees all, customer/provider see their own)
exports.getAllRequests = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const { pageNum, limitNum, offset } = parsePagination(page, limit);

        const where = {};
        if (status) where.status = status;

        // Role-based filtering
        if (req.user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId: req.user.userId } });
            if (!customer) return errorResponse(res, 'Customer profile not found.', 404);
            where.customerId = customer.customerId;
        } else if (req.user.role === 'provider') {
            const provider = await Provider.findOne({ where: { userId: req.user.userId } });
            if (!provider) return errorResponse(res, 'Provider profile not found.', 404);
            where.providerId = provider.providerId;
        }
        // If admin, no additional filtering - they see all requests

        const { count, rows } = await ServiceRequest.findAndCountAll({
            where,
            include: [
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
                { model: Service, as: 'service', include: [{ model: Category, as: 'category' }] },
            ],
            limit: limitNum,
            offset,
            order: [['requestDate', 'DESC']],
        });

        return paginatedResponse(res, rows, pageNum, limitNum, count, 'Requests retrieved successfully');
    } catch (error) {
        console.error('\n❌ ERROR in getAllRequests:');
        console.error('Message:', error.message);
        console.error('SQL:', error.sql || 'N/A');
        console.error('Stack:', error.stack);
        return next(error);
    }
};

// Get request by ID
exports.getRequestById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const request = await ServiceRequest.findByPk(id, {
            include: [
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
                {
                    model: Service,
                    as: 'service',
                    include: [{ model: Category, as: 'category' }],
                },
                { model: Payment, as: 'payments' },
                {
                    model: StatusHistory,
                    as: 'history',
                    include: [{ model: User, as: 'changedByUser', attributes: USER_SAFE_ATTRS }],
                },
            ],
            order: [[{ model: StatusHistory, as: 'history' }, 'createdAt', 'DESC']],
        });

        if (!request) return errorResponse(res, 'Request not found.', 404);
        return successResponse(res, request, 'Request retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Create service request (customer only)
exports.createRequest = async (req, res, next) => {
    try {
        const { service_id, scheduled_date, details, problem_type, address } = req.body;
        if (!service_id) return errorResponse(res, 'service_id is required.', 400);

        const customer = await Customer.findOne({ where: { userId: req.user.userId } });
        if (!customer) return errorResponse(res, 'Customer profile not found.', 404);

        const service = await Service.findByPk(service_id);
        if (!service) return errorResponse(res, 'Service not found.', 404);

        const request = await ServiceRequest.create({
            customerId: customer.customerId,
            providerId: service.providerId,
            serviceId: service_id,
            scheduledDate: scheduled_date || null,
            details: details || null,
            problemType: problem_type || null,
            address: address || null,
            price: service.price,
            status: 'pending',
            requestDate: new Date(),
        });

        // Status history per SQL columns
        await StatusHistory.create({
            serviceRequestId: request.requestId,
            oldStatusId: null,
            newStatusId: null,
            changedBy: req.user.userId,
            createdAt: new Date(),
        });

        // Send notification to provider about new request
        const { sendNotification } = require('./notification.controller');
        const providerData = await Provider.findByPk(service.providerId, {
            include: [{ model: User, as: 'user' }],
        });
        if (providerData?.user) {
            await sendNotification(
                providerData.user.userId,
                'new_request',
                'طلب خدمة جديد',
                'New Service Request',
                `لديك طلب خدمة جديد من العميل لخدمة "${service.nameAr || service.nameEn}"`,
                `You have a new service request from a customer for "${service.nameEn || service.nameAr}"`,
                request.requestId
            );
        }

        const createdRequest = await ServiceRequest.findByPk(request.requestId, {
            include: [
                { model: Service, as: 'service', include: [{ model: Category, as: 'category' }] },
                { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: StatusHistory, as: 'history', include: [{ model: User, as: 'changedByUser', attributes: USER_SAFE_ATTRS }] },
            ],
            order: [[{ model: StatusHistory, as: 'history' }, 'createdAt', 'DESC']],
        });

        return successResponse(res, createdRequest, 'Request created successfully', 201);
    } catch (error) {
        return next(error);
    }
};

// Update request status (provider/admin)
exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return errorResponse(res, 'status is required.', 400);

        // MUST match SQL enum: in_progress, on_the_way (WITH underscores)
        const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'on_the_way', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) return errorResponse(res, 'Invalid status value.', 400);

        const request = await ServiceRequest.findByPk(id);
        if (!request) return errorResponse(res, 'Request not found.', 404);

        if (req.user.role === 'provider') {
            const provider = await Provider.findOne({ where: { userId: req.user.userId } });
            if (!provider || request.providerId !== provider.providerId) return errorResponse(res, 'Unauthorized.', 403);
        } else if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized.', 403);
        }

        // CRITICAL: Get old status BEFORE updating
        const oldStatus = request.status;

        // Update servicerequest.status
        await request.update({ status });

        // CRITICAL: Write to status_history table on EVERY status change
        await StatusHistory.create({
            serviceRequestId: request.requestId,
            oldStatusId: null, // We don't use status table IDs, just track in history
            newStatusId: null,
            changedBy: req.user.userId,
            createdAt: new Date(),
        });

        // Send notification on status change
        const { sendNotification } = require('./notification.controller');
        const customerData = await Customer.findByPk(request.customerId, {
            include: [{ model: User, as: 'user' }],
        });

        if (customerData?.user) {
            const statusMessages = {
                accepted: { ar: 'تم قبول طلبك', en: 'Your request has been accepted' },
                rejected: { ar: 'تم رفض طلبك', en: 'Your request has been rejected' },
                in_progress: { ar: 'جاري العمل على طلبك', en: 'Work in progress on your request' },
                on_the_way: { ar: 'مقدم الخدمة في الطريق', en: 'Provider is on the way' },
                completed: { ar: 'تم إكمال الخدمة', en: 'Service completed' },
                cancelled: { ar: 'تم إلغاء طلبك', en: 'Your request has been cancelled' },
            };

            const msg = statusMessages[status];
            if (msg) {
                await sendNotification(
                    customerData.user.userId,
                    'status_update',
                    msg.ar,
                    msg.en,
                    `تم تحديث حالة الطلب من "${oldStatus}" إلى "${status}"`,
                    `Request status updated from "${oldStatus}" to "${status}"`,
                    request.requestId
                );
            }
        }

        const updatedRequest = await ServiceRequest.findByPk(id, {
            include: [
                { model: Service, as: 'service', include: [{ model: Category, as: 'category' }] },
                { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: StatusHistory, as: 'history', include: [{ model: User, as: 'changedByUser', attributes: USER_SAFE_ATTRS }] },
            ],
            order: [[{ model: StatusHistory, as: 'history' }, 'createdAt', 'DESC']],
        });

        return successResponse(res, updatedRequest, `Request status updated (${oldStatus} → ${status})`);
    } catch (error) {
        return next(error);
    }
};

// Complete request with payment (provider/admin)
exports.completeRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { final_price, payment_method } = req.body;

        if (!final_price || final_price <= 0) {
            return errorResponse(res, 'final_price is required and must be greater than 0.', 400);
        }

        const request = await ServiceRequest.findByPk(id, {
            include: [
                { model: Customer, as: 'customer', include: [{ model: User, as: 'user' }] },
                { model: Service, as: 'service' },
            ],
        });

        if (!request) return errorResponse(res, 'Request not found.', 404);

        // Authorization check
        if (req.user.role === 'provider') {
            const provider = await Provider.findOne({ where: { userId: req.user.userId } });
            if (!provider || request.providerId !== provider.providerId) {
                return errorResponse(res, 'Unauthorized.', 403);
            }
        } else if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized.', 403);
        }

        // Update request status to completed
        const oldStatus = request.status;
        await request.update({ status: 'completed', price: final_price });

        // Create status history
        await StatusHistory.create({
            serviceRequestId: request.requestId,
            oldStatusId: null,
            newStatusId: null,
            changedBy: req.user.userId,
            createdAt: new Date(),
        });

        // Create payment record
        const payment = await Payment.create({
            requestId: request.requestId,
            amount: final_price,
            method: payment_method || 'cash',
            status: 'pending',
            transactionDate: new Date(),
            getawayResponse: null,
            createdAt: new Date(),
        });

        // Send notification to customer
        const { sendNotification } = require('./notification.controller');
        const customerUser = request.customer?.user;
        if (customerUser) {
            await sendNotification(
                customerUser.userId,
                'request_completed',
                'تم إكمال الخدمة',
                'Service Completed',
                `تم إكمال خدمة "${request.service?.nameAr || 'الخدمة'}" بنجاح. المبلغ النهائي: ${final_price}`,
                `Service "${request.service?.nameEn || 'Service'}" has been completed successfully. Final amount: ${final_price}`,
                request.requestId
            );
        }

        // Fetch updated request with all includes
        const completedRequest = await ServiceRequest.findByPk(id, {
            include: [
                { model: Service, as: 'service', include: [{ model: Category, as: 'category' }] },
                { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }] },
                { model: Payment, as: 'payments' },
                { model: StatusHistory, as: 'history', include: [{ model: User, as: 'changedByUser', attributes: USER_SAFE_ATTRS }] },
            ],
            order: [[{ model: StatusHistory, as: 'history' }, 'createdAt', 'DESC']],
        });

        return successResponse(res, {
            request: completedRequest,
            payment,
        }, 'Request completed successfully with payment created');
    } catch (error) {
        return next(error);
    }
};

// Delete/cancel request (customer can delete own, admin can delete any)
exports.deleteRequest = async (req, res, next) => {
    try {
        const { id } = req.params;

        const request = await ServiceRequest.findByPk(id);
        if (!request) return errorResponse(res, 'Request not found.', 404);

        // Customer can only delete their own requests
        if (req.user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId: req.user.userId } });
            if (!customer || request.customerId !== customer.customerId) {
                return errorResponse(res, 'Unauthorized.', 403);
            }
        } else if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized.', 403);
        }

        await request.destroy();
        return successResponse(res, null, 'Request deleted successfully');
    } catch (error) {
        return next(error);
    }
};
