const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/stats', authMiddleware, requireRole('admin'), adminController.getStats);

router.get('/users', authMiddleware, requireRole('admin'), userController.getAllUsers);
router.get('/users/:id', authMiddleware, requireRole('admin'), userController.getUserById);
router.patch('/users/:id', authMiddleware, requireRole('admin'), userController.updateUser);

module.exports = router;
