const express = require('express');
const router = express.Router();

const certificateController = require('../controllers/certificate.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const upload = require('../middlewares/upload.middleware');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

const certificateValidation = [
    body('title').custom((value) => {
        if (value !== undefined) throw new Error('Certificate does not accept title field');
        return true;
    }),
    body('description').custom((value) => {
        if (value !== undefined) throw new Error('Certificate does not accept description field');
        return true;
    }),
    validate,
];

// Public
router.get('/provider/:providerId', certificateController.getCertificatesByProvider);

// Protected
router.post('/', authMiddleware, requireRole('provider'), upload.single('certificate'), certificateValidation, certificateController.createCertificate);
router.delete('/:id', authMiddleware, requireRole('provider', 'admin'), certificateController.deleteCertificate);

module.exports = router;
