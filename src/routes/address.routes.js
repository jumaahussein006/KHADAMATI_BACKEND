const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All address routes require authentication
router.get('/', authMiddleware, addressController.getMyAddresses);
router.get('/search-cities', addressController.searchCities); // Public for autocomplete
router.get('/:id', authMiddleware, addressController.getAddressById);
router.post('/', authMiddleware, addressController.createAddress);
router.put('/:id', authMiddleware, addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports = router;
