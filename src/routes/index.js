const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const serviceRoutes = require('./service.routes');
const serviceRequestRoutes = require('./serviceRequest.routes');
const paymentRoutes = require('./payment.routes');
const reviewRoutes = require('./review.routes');
const notificationRoutes = require('./notification.routes');
const addressRoutes = require('./address.routes');
const certificateRoutes = require('./certificate.routes');
const reportRoutes = require('./report.routes');
const nameChangeRoutes = require('./nameChange.routes');
const providerRoutes = require('./provider.routes');
const customerRoutes = require('./customer.routes');
const adminRoutes = require('./admin.routes');

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'connected',
    });
});

// Mount all API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/requests', serviceRequestRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/addresses', addressRoutes);
router.use('/certificates', certificateRoutes);
router.use('/reports', reportRoutes);
router.use('/name-changes', nameChangeRoutes);
router.use('/providers', providerRoutes);
router.use('/customers', customerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
