const { User, Customer, Provider, Admin } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');
const { serializeUser } = require('../utils/serializer.util');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                { model: Customer, as: 'customerProfile' },
                { model: Provider, as: 'providerProfile' },
                { model: Admin, as: 'adminProfile' },
            ],
        });

        const serialized = users.map(serializeUser);
        return successResponse(res, serialized, 'Users retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Customer, as: 'customerProfile' },
                { model: Provider, as: 'providerProfile' },
                { model: Admin, as: 'adminProfile' },
            ],
        });

        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        return successResponse(res, serializeUser(user), 'User retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Update user (admin only)
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // support both snake_case + camelCase coming from frontend/legacy
        const first_name = req.body.first_name ?? req.body.firstname ?? req.body.firstName;
        const middle_name = req.body.middle_name ?? req.body.middlename ?? req.body.middleName;
        const last_name = req.body.last_name ?? req.body.lastname ?? req.body.lastName;
        const phone = req.body.phone ?? req.body.phonenumber ?? req.body.phoneNumber;
        const role = req.body.role;

        const user = await User.findByPk(id);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        const updates = {};
        if (first_name !== undefined) updates.firstName = first_name;
        if (middle_name !== undefined) updates.middleName = middle_name;
        if (last_name !== undefined) updates.lastName = last_name;
        if (phone !== undefined) updates.phone = phone;

        if (role !== undefined) {
            if (!['admin', 'customer', 'provider'].includes(role)) {
                return errorResponse(res, 'Invalid role.', 400);
            }
            updates.role = role;
        }

        await user.update(updates);

        const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        return successResponse(res, serializeUser(updatedUser), 'User updated successfully');
    } catch (error) {
        return next(error);
    }
};
