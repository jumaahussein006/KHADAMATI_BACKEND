const express = require('express');
const router = express.Router();

const nameChangeController = require('../controllers/nameChange.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Routes
router.post('/', authMiddleware, nameChangeController.createNameChangeRequest);
router.get('/', authMiddleware, requireRole('admin'), nameChangeController.getAllNameChangeRequests);
router.patch('/:id', authMiddleware, requireRole('admin'), nameChangeController.updateNameChangeRequest);

module.exports = router;
