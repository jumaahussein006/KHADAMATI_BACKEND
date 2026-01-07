const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All notification routes require authentication
router.get('/', authMiddleware, notificationController.getNotifications);
router.post('/', authMiddleware, notificationController.createNotification);
router.post('/mark-read', authMiddleware, notificationController.markAsRead);
router.post('/mark-all-read', authMiddleware, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
