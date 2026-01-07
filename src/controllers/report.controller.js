const { Report, User, ServiceRequest } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

// Get all reports (admin only)
exports.getAllReports = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized. Admin access required.', 403);
        }

        const reports = await Report.findAll({
            include: [
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['userId', 'firstName', 'middleName', 'lastName', 'email', 'role']
                },
                {
                    model: User,
                    as: 'admin',
                    attributes: ['userId', 'firstName', 'lastName'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, reports, 'Reports retrieved successfully');
    } catch (error) {
        console.error('Get reports error:', error);
        return next(error);
    }
};

// Get reports submitted by current user
exports.getMySubmittedReports = async (req, res, next) => {
    try {
        const reports = await Report.findAll({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, reports, 'Your submitted reports retrieved successfully');
    } catch (error) {
        console.error('Get my submitted reports error:', error);
        return next(error);
    }
};

// Create report (any authenticated user can report to admin)
exports.createReport = async (req, res, next) => {
    try {
        const { target_user_id, request_id, reason, description } = req.body;

        // Validation
        if (!reason || !description) {
            return errorResponse(res, 'reason and description are required.', 400);
        }

        // Determine target type and ID
        let targetType = null;
        let targetId = null;

        if (request_id) {
            targetType = 'request';
            targetId = request_id;

            // Verify request exists
            const request = await ServiceRequest.findByPk(request_id);
            if (!request) {
                return errorResponse(res, `Service request with ID ${request_id} not found.`, 404);
            }
        } else if (target_user_id) {
            targetType = 'user';
            targetId = target_user_id;

            // Verify user exists
            const targetUser = await User.findByPk(target_user_id);
            if (!targetUser) {
                return errorResponse(res, `User with ID ${target_user_id} not found.`, 404);
            }
        } else {
            return errorResponse(res, 'Either target_user_id or request_id must be provided.', 400);
        }

        const report = await Report.create({
            userId: req.user.userId,
            adminId: null,
            reportType: 'user_report',
            targetType: targetType,
            targetId: targetId,
            title: reason,
            content: description,
            adminReply: null,
            createdAt: new Date(),
        });

        return successResponse(res, report, 'Report submitted successfully to admin', 201);
    } catch (error) {
        console.error('Create report error:', error);
        return next(error);
    }
};

// Update report (admin only - to add reply)
exports.updateReport = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized. Admin access required.', 403);
        }

        const { id } = req.params;
        const { admin_reply } = req.body;

        const report = await Report.findByPk(id);
        if (!report) {
            return errorResponse(res, 'Report not found.', 404);
        }

        await report.update({
            adminReply: admin_reply,
            adminId: req.user.userId
        });

        // Notify the reporter
        const { sendNotification } = require('./notification.controller');
        await sendNotification(
            report.userId,
            'report_update',
            'رد الإدارة على تقريرك',
            'Admin Reply to Your Report',
            `تلقى تقريرك ردًا من الإدارة`,
            `Your report has received an admin reply`,
            report.reportId
        );

        return successResponse(res, report, 'Report updated successfully');
    } catch (error) {
        console.error('Update report error:', error);
        return next(error);
    }
};

// Delete report (admin only)
exports.deleteReport = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized. Admin access required.', 403);
        }

        const { id } = req.params;
        const report = await Report.findByPk(id);

        if (!report) {
            return errorResponse(res, 'Report not found.', 404);
        }

        await report.destroy();
        return successResponse(res, null, 'Report deleted successfully');
    } catch (error) {
        console.error('Delete report error:', error);
        return next(error);
    }
};
