const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

const reviewValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate,
];

router.get('/service/:serviceId', reviewController.getReviewsByService);
router.get('/provider/:providerId', reviewController.getReviewsByProvider);

router.post('/', authMiddleware, requireRole('customer'), reviewValidation, reviewController.createReview);
router.patch('/:reviewId', authMiddleware, requireRole('customer'), reviewValidation, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, requireRole('customer', 'admin'), reviewController.deleteReview);

module.exports = router;
