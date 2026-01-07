const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Customer
router.get('/my-payments', authMiddleware, requireRole('customer'), paymentController.getMyPayments);

// Provider
router.get('/provider-payments', authMiddleware, requireRole('provider'), paymentController.getProviderPayments);

// Create (authenticated)
router.post('/', authMiddleware, paymentController.createPayment);

// Admin
router.get('/', authMiddleware, requireRole('admin'), paymentController.getAllPayments);
router.put('/:id', authMiddleware, requireRole('admin'), paymentController.updatePayment);
router.delete('/:id', authMiddleware, requireRole('admin'), paymentController.deletePayment);

module.exports = router;
