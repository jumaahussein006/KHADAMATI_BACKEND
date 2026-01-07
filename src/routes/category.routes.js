const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

// Validation rules
const categoryValidation = [
    body('name_ar').trim().notEmpty().withMessage('name_ar is required'),
    body('name_en').trim().notEmpty().withMessage('name_en is required'),

    body('name').custom((value) => {
        if (value !== undefined) {
            throw new Error('Use name_ar and name_en instead of name');
        }
        return true;
    }),

    body('description').custom((value) => {
        if (value !== undefined) {
            throw new Error('Use description_ar and description_en instead of description');
        }
        return true;
    }),

    validate,
];

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/', authMiddleware, requireRole('admin'), categoryValidation, categoryController.createCategory);
router.put('/:id', authMiddleware, requireRole('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, requireRole('admin'), categoryController.deleteCategory);

module.exports = router;
