const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/profile', authMiddleware, requireRole('customer'), customerController.getProfile);
router.patch('/profile', authMiddleware, requireRole('customer'), customerController.updateProfile);

module.exports = router;
