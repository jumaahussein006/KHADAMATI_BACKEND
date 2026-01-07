const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', authMiddleware, requireRole('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, requireRole('admin'), userController.getUserById);
router.patch('/:id', authMiddleware, requireRole('admin'), userController.updateUser);

module.exports = router;
