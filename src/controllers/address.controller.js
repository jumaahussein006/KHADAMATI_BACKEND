const { Address } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');
const { Op } = require('sequelize');

// Get user addresses
exports.getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.findAll({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, addresses, 'Addresses retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get address by ID
exports.getAddressById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const address = await Address.findOne({
            where: {
                addressId: id,
                userId: req.user.userId,
            },
        });

        if (!address) {
            return errorResponse(res, 'Address not found.', 404);
        }

        return successResponse(res, address, 'Address retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Create address
exports.createAddress = async (req, res, next) => {
    try {
        const { city, street, building, floor, country } = req.body;

        if (!city || !street) {
            return errorResponse(res, 'city and street are required.', 400);
        }

        const address = await Address.create({
            userId: req.user.userId,
            city,
            street,
            building: building ?? null,
            floor: floor ?? null,
            country: country || 'Lebanon',
            createdAt: new Date(),
        });

        return successResponse(res, address, 'Address created successfully', 201);
    } catch (error) {
        return next(error);
    }
};

// Update address
exports.updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { city, street, building, floor, country } = req.body;

        const address = await Address.findOne({
            where: {
                addressId: id,
                userId: req.user.userId,
            },
        });

        if (!address) {
            return errorResponse(res, 'Address not found.', 404);
        }

        const updates = {};
        if (city !== undefined) updates.city = city;
        if (street !== undefined) updates.street = street;
        if (building !== undefined) updates.building = building;
        if (floor !== undefined) updates.floor = floor;
        if (country !== undefined) updates.country = country;

        await address.update(updates);

        return successResponse(res, address, 'Address updated successfully');
    } catch (error) {
        return next(error);
    }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        const address = await Address.findOne({
            where: {
                addressId: id,
                userId: req.user.userId,
            },
        });

        if (!address) {
            return errorResponse(res, 'Address not found.', 404);
        }

        await address.destroy();

        return successResponse(res, null, 'Address deleted successfully');
    } catch (error) {
        return next(error);
    }
};

// Search cities (for autocomplete)
exports.searchCities = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return errorResponse(res, 'query parameter is required.', 400);
        }

        // مهم: sequelize لازم يجي من الـ model
        const sequelize = Address.sequelize;

        const rows = await Address.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('city')), 'city']],
            where: {
                city: { [Op.like]: `%${query}%` },
            },
            limit: 10,
        });

        const cityList = rows.map((r) => r.get('city')).filter(Boolean);

        return successResponse(res, cityList, 'Cities retrieved successfully');
    } catch (error) {
        return next(error);
    }
};
