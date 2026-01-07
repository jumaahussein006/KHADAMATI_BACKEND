const { Customer, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');
const { serializeCustomer } = require('../utils/serializer.util');

// Get customer profile
exports.getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            where: { userId: req.user.userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] },
                },
            ],
        });

        if (!customer) {
            return errorResponse(res, 'Customer profile not found.', 404);
        }

        return successResponse(res, serializeCustomer(customer), 'Customer profile retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

// Update customer profile
exports.updateProfile = async (req, res, next) => {
    try {
        console.log('=== CUSTOMER PROFILE UPDATE ===');
        console.log('User ID:', req.user.userId);
        console.log('Request body:', req.body);

        const customer = await Customer.findOne({
            where: { userId: req.user.userId },
            include: [{ model: User, as: 'user' }]
        });

        if (!customer) {
            console.error('Customer not found for userId:', req.user.userId);
            return errorResponse(res, 'Customer profile not found.', 404);
        }

        console.log('Customer found, updating...');

        // Update user table fields (phone, email if needed)
        const { phone, email } = req.body;
        const userUpdates = {};

        if (phone !== undefined) userUpdates.phone = phone;
        if (email !== undefined) userUpdates.email = email;

        console.log('User updates:', userUpdates);

        if (Object.keys(userUpdates).length > 0) {
            const [updateCount] = await User.update(userUpdates, { where: { userId: req.user.userId } });
            console.log('User table updated, affected rows:', updateCount);
        }

        // Reload to get updated data
        await customer.reload();
        console.log('Profile update successful');

        return successResponse(res, serializeCustomer(customer), 'Customer profile updated successfully');
    } catch (error) {
        console.error('=== CUSTOMER PROFILE UPDATE ERROR ===');
        console.error('Error:', error);
        return next(error);
    }
};
