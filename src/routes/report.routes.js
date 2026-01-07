const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Admin routes
router.get('/', authMiddleware, requireRole('admin'), reportController.getAllReports);
router.patch('/:id', authMiddleware, requireRole('admin'), reportController.updateReport);
router.delete('/:id', authMiddleware, requireRole('admin'), reportController.deleteReport);

// User routes (any authenticated user can create reports to admin)
router.post('/', authMiddleware, reportController.createReport);
router.get('/my-submitted', authMiddleware, reportController.getMySubmittedReports);

module.exports = router;
