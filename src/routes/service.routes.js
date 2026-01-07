const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const upload = require('../middlewares/upload.middleware');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

const serviceValidation = [
    body('name_ar').trim().notEmpty().withMessage('name_ar is required'),
    body('name_en').trim().notEmpty().withMessage('name_en is required'),
    body('category_id').isInt().withMessage('category_id must be an integer'),
    body('price').isFloat({ min: 0 }).withMessage('price must be a positive number'),

    body('name').custom((value) => {
        if (value !== undefined) throw new Error('Use name_ar and name_en instead of name');
        return true;
    }),

    body('description').custom((value) => {
        if (value !== undefined) throw new Error('Use description_ar and description_en instead of description');
        return true;
    }),

    body('title').custom((value) => {
        if (value !== undefined) throw new Error('Use name_ar and name_en instead of title');
        return true;
    }),

    validate,
];

// Public
router.get('/search', serviceController.searchServices);
router.get('/', serviceController.getAllServices);
router.get('/provider/:providerId', serviceController.getServicesByProvider);
router.get('/:id', serviceController.getServiceById);

// Protected
router.post('/', authMiddleware, requireRole('provider'), upload.array('images', 5), serviceController.createService);
router.put('/:id', authMiddleware, requireRole('provider', 'admin'), serviceController.updateService);
router.delete('/:id', authMiddleware, requireRole('provider', 'admin'), serviceController.deleteService);

module.exports = router;
