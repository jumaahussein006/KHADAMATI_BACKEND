const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Customer, Provider, Admin } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

const signToken = (user) =>
    jwt.sign(
        { userId: user.userId, role: user.role },
        process.env.JWT_SECRET || 'khadamati-secret-key-2024',
        { expiresIn: '7d' }
    );

const buildAuthResponse = async (user) => {
    let roleId = null;

    if (user.role === 'customer') {
        const customer = await Customer.findOne({ where: { userId: user.userId } });
        roleId = customer?.customerId ?? null;
    } else if (user.role === 'provider') {
        const provider = await Provider.findOne({ where: { userId: user.userId } });
        roleId = provider?.providerId ?? null;
    } else if (user.role === 'admin') {
        const admin = await Admin.findOne({ where: { userId: user.userId } });
        roleId = admin?.adminId ?? null;
    }

    const token = signToken(user);

    const response = {
        user: {
            user_id: user.userId,
            email: user.email,
            first_name: user.firstName,
            middle_name: user.middleName,
            last_name: user.lastName,
            phone: user.phone,
            role: user.role,
        },
        token,
    };

    if (user.role === 'customer') response.customer_id = roleId;
    if (user.role === 'provider') response.provider_id = roleId;
    if (user.role === 'admin') response.admin_id = roleId;

    return response;
};

exports.register = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, middle_name, phone, role } = req.body;

        if (!email || !password || !first_name || !last_name || !phone || !role) {
            return errorResponse(res, 'email, password, first_name, last_name, phone, and role are required.', 400);
        }

        if (!['customer', 'provider'].includes(role)) {
            return errorResponse(res, 'role must be either customer or provider.', 400);
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return errorResponse(res, 'Email already exists.', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            firstName: first_name,
            middleName: middle_name ?? null,
            lastName: last_name,
            phone,
            role,
            createdAt: new Date(),
        });

        if (role === 'customer') {
            await Customer.create({ userId: user.userId });
        } else {
            await Provider.create({
                userId: user.userId,
                rating: 0.0,
                totalReviews: 0,
                isVerified: false,
            });
        }

        const response = await buildAuthResponse(user);
        return successResponse(res, response, 'User registered successfully', 201);
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'email and password are required.', 400);
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return errorResponse(res, 'Invalid email or password.', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid email or password.', 401);
        }

        const response = await buildAuthResponse(user);
        return successResponse(res, response, 'Login successful');
    } catch (error) {
        return next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['userId', 'email', 'firstName', 'middleName', 'lastName', 'phone', 'role', 'createdAt'],
        });

        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        let roleData = {};

        if (user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId: user.userId } });
            roleData = { customer_id: customer?.customerId ?? null };
        } else if (user.role === 'provider') {
            const provider = await Provider.findOne({ where: { userId: user.userId } });
            roleData = {
                provider_id: provider?.providerId ?? null,
                experience_years: provider?.experienceYears ?? null,
                rating: provider?.rating ?? null,
                total_reviews: provider?.totalReviews ?? null,
                is_verified: provider?.isVerified ?? null,
            };
        } else if (user.role === 'admin') {
            const admin = await Admin.findOne({ where: { userId: user.userId } });
            roleData = { admin_id: admin?.adminId ?? null };
        }

        return successResponse(res, { ...user.toJSON(), ...roleData }, 'User retrieved successfully');
    } catch (error) {
        return next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { first_name, middle_name, last_name, phone } = req.body;

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        const updates = {};
        if (first_name !== undefined) updates.firstName = first_name;
        if (middle_name !== undefined) updates.middleName = middle_name;
        if (last_name !== undefined) updates.lastName = last_name;
        if (phone !== undefined) updates.phone = phone;

        await user.update(updates);

        return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
        return next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return errorResponse(res, 'old_password and new_password are required.', 400);
        }

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid old password.', 400);
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await user.update({ password: hashedPassword });

        return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        return next(error);
    }
};
