const express = require('express');
const router = express.Router();

const serviceRequestController = require('../controllers/serviceRequest.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Customer routes
router.get('/my-requests', authMiddleware, requireRole('customer'), serviceRequestController.getMyRequests);
router.post('/', authMiddleware, requireRole('customer'), serviceRequestController.createRequest);
router.delete('/:id', authMiddleware, serviceRequestController.deleteRequest);

// Provider routes
router.get('/provider-requests', authMiddleware, requireRole('provider'), serviceRequestController.getProviderRequests);
router.get('/provider', authMiddleware, requireRole('provider'), serviceRequestController.getProviderRequests); // Alias for frontend
router.put('/:id/status', authMiddleware, serviceRequestController.updateRequestStatus);
router.put('/:id/complete', authMiddleware, serviceRequestController.completeRequest);

// Admin & general
router.get('/', authMiddleware, serviceRequestController.getAllRequests);
router.get('/:id', authMiddleware, serviceRequestController.getRequestById);

module.exports = router;
