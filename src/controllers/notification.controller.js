const { Notification } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

// Get all notifications for user
exports.getNotifications = async (req, res, next) => {
    try {
        const { is_read, limit = 50 } = req.query;

        const where = { userId: req.user.userId };
        if (is_read !== undefined) {
            where.isRead = is_read === 'true';
        }

        const notifications = await Notification.findAll({
            where,
            attributes: [
                'notificationId',
                'userId',
                'type',
                'titleAr',
                'titleEn',
                'messageAr',
                'messageEn',
                'relatedId',
                'isRead',
                'createdAt',
            ],
            limit: parseInt(limit, 10),
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, notifications, 'Notifications retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Create notification
exports.createNotification = async (req, res, next) => {
    try {
        const { user_id, type, title_ar, title_en, message_ar, message_en, title, message, send_to_all } = req.body;

        console.log('=== CREATE NOTIFICATION ===');
        console.log('Request body:', req.body);

        // Support both single language and bilingual inputs
        let finalTitleAr = title_ar;
        let finalTitleEn = title_en;
        let finalMessageAr = message_ar;
        let finalMessageEn = message_en;

        // If only 'title' and 'message' are provided, use them for both languages
        if (!title_ar && !title_en && title) {
            finalTitleAr = title;
            finalTitleEn = title;
        }
        if (!message_ar && !message_en && message) {
            finalMessageAr = message;
            finalMessageEn = message;
        }

        if (!finalTitleAr || !finalTitleEn || !finalMessageAr || !finalMessageEn) {
            return errorResponse(
                res,
                'Title and message are required (either bilingual or single language).',
                400
            );
        }

        // Handle broadcast to all users
        if (send_to_all) {
            const { User } = require('../models');
            const allUsers = await User.findAll({ attributes: ['userId'] });

            const notifications = await Promise.all(
                allUsers.map(user =>
                    Notification.create({
                        userId: user.userId,
                        type: type || 'general',
                        titleAr: finalTitleAr,
                        titleEn: finalTitleEn,
                        messageAr: finalMessageAr,
                        messageEn: finalMessageEn,
                        relatedId: null,
                        isRead: false,
                        createdAt: new Date(),
                    })
                )
            );

            console.log(`Broadcast notification sent to ${notifications.length} users`);
            return successResponse(res, { count: notifications.length }, 'Notifications sent to all users successfully', 201);
        }

        // Send to specific user
        const targetUserId = user_id || req.user.userId;

        const notification = await Notification.create({
            userId: targetUserId,
            type: type || 'general',
            titleAr: finalTitleAr,
            titleEn: finalTitleEn,
            messageAr: finalMessageAr,
            messageEn: finalMessageEn,
            relatedId: req.body.related_id ?? null,
            isRead: false,
            createdAt: new Date(),
        });

        console.log('Notification created successfully');
        return successResponse(res, notification, 'Notification created successfully', 201);
    } catch (error) {
        console.error('=== CREATE NOTIFICATION ERROR ===');
        console.error('Error:', error);
        return next(error);
    }
};

// Mark notifications as read
exports.markAsRead = async (req, res, next) => {
    try {
        const { notification_ids } = req.body;

        if (!notification_ids || !Array.isArray(notification_ids)) {
            return errorResponse(res, 'notification_ids must be an array.', 400);
        }

        await Notification.update(
            { isRead: true },
            {
                where: {
                    notificationId: notification_ids,
                    userId: req.user.userId,
                },
            }
        );

        return successResponse(res, null, 'Notifications marked as read');
    } catch (error) {
        return next(error);
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.update(
            { isRead: true },
            {
                where: {
                    userId: req.user.userId,
                    isRead: false,
                },
            }
        );

        return successResponse(res, null, 'All notifications marked as read');
    } catch (error) {
        return next(error);
    }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOne({
            where: {
                notificationId: id,
                userId: req.user.userId,
            },
        });

        if (!notification) {
            return errorResponse(res, 'Notification not found.', 404);
        }

        await notification.destroy();

        return successResponse(res, null, 'Notification deleted successfully');
    } catch (error) {
        return next(error);
    }
};

// Helper function to send notification (used by other controllers)
exports.sendNotification = async (
    userId,
    type,
    titleAr,
    titleEn,
    messageAr,
    messageEn,
    relatedId = null
) => {
    await Notification.create({
        userId,
        type,
        titleAr,
        titleEn,
        messageAr,
        messageEn,
        relatedId,
        isRead: false,
        createdAt: new Date(),
    });
};
