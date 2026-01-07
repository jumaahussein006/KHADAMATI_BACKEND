const { NameChangeRequest, User, Admin } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

const VALID_STATUSES = ['pending', 'approved', 'rejected'];
const USER_SAFE_ATTRS = ['userId', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'role', 'createdAt'];

// Create name change request (authenticated user)
exports.createNameChangeRequest = async (req, res, next) => {
    try {
        // Support both snake_case and camelCase for resilience
        const new_firstname = req.body.new_firstname || req.body.newFirstName;
        const new_middlename = req.body.new_middlename || req.body.newMiddleName;
        const new_lastname = req.body.new_lastname || req.body.newLastName;

        if (!new_firstname || !new_lastname) {
            return errorResponse(res, 'new_firstname and new_lastname are required.', 400);
        }

        const user = await User.findByPk(req.user.userId);
        if (!user) return errorResponse(res, 'User not found.', 404);

        const request = await NameChangeRequest.create({
            userId: req.user.userId,
            oldFirstName: user.firstName,
            oldMiddleName: user.middleName,
            oldLastName: user.lastName,
            newFirstName: new_firstname,
            newMiddleName: new_middlename || null,
            newLastName: new_lastname,
            status: 'pending',
            createdAt: new Date(),
            reviewedAt: null,
            reviewedBy: null,
        });

        return successResponse(res, request, 'Name change request created successfully', 201);
    } catch (error) {
        return next(error);
    }
};

// Get all name change requests (admin only)
exports.getAllNameChangeRequests = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return errorResponse(res, 'Unauthorized.', 403);

        const requests = await NameChangeRequest.findAll({
            include: [{ model: User, as: 'user', attributes: USER_SAFE_ATTRS }],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, requests, 'Name change requests retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Update name change request status (admin only)
exports.updateNameChangeRequest = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return errorResponse(res, 'Unauthorized.', 403);

        const { id } = req.params;
        const { status } = req.body;

        if (!status) return errorResponse(res, 'status is required.', 400);
        if (!VALID_STATUSES.includes(status)) return errorResponse(res, 'Invalid status value.', 400);

        const request = await NameChangeRequest.findByPk(id);
        if (!request) return errorResponse(res, 'Name change request not found.', 404);

        // If approved, update user's name
        if (status === 'approved') {
            await User.update(
                {
                    firstName: request.newFirstName,
                    middleName: request.newMiddleName,
                    lastName: request.newLastName,
                },
                { where: { userId: request.userId } }
            );
        }

        const adminProfile = await Admin.findOne({ where: { userId: req.user.userId } });

        await request.update({
            status,
            reviewedAt: new Date(),
            reviewedBy: adminProfile ? adminProfile.adminId : null,
        });

        // Send notification to user
        const { sendNotification } = require('./notification.controller');
        if (status === 'approved') {
            await sendNotification(
                request.userId,
                'name_change_approved',
                'تمت الموافقة على طلب تغيير الاسم',
                'Name Change Approved',
                `تمت الموافقة على طلبك لتغيير الاسم إلى: ${request.newFirstName} ${request.newLastName}`,
                `Your name change request has been approved. New name: ${request.newFirstName} ${request.newLastName}`,
                request.requestId
            );
        } else if (status === 'rejected') {
            await sendNotification(
                request.userId,
                'name_change_rejected',
                'تم رفض طلب تغيير الاسم',
                'Name Change Rejected',
                'تم رفض طلبك لتغيير الاسم من قبل الإدارة',
                'Your name change request has been rejected by admin',
                request.requestId
            );
        }

        return successResponse(res, request, 'Name change request updated successfully');
    } catch (error) {
        return next(error);
    }
};
