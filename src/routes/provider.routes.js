const express = require('express');
const router = express.Router();

const providerController = require('../controllers/provider.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Protected routes (provider only) - MUST be before "/:providerId"
router.get('/profile/me', authMiddleware, requireRole('provider'), providerController.getMyProfile);
router.put('/profile', authMiddleware, requireRole('provider'), providerController.updateProfile);

// Public routes
router.get('/', providerController.getAllProviders);
router.get('/:providerId', providerController.getProviderById);

module.exports = router;
