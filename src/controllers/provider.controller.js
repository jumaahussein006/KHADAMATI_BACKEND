const { Provider, User, Service, Certificate } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');
const { serializeProvider } = require('../utils/serializer.util');

// Get all providers (public)
exports.getAllProviders = async (req, res, next) => {
    try {
        const providers = await Provider.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] },
                },
            ],
            order: [['rating', 'DESC']],
        });

        const result = providers.map((p) => serializeProvider(p));
        return successResponse(res, result, 'Providers retrieved successfully');
    } catch (error) {
        console.error('Provider getAllProviders error:', error);
        return next(error);
    }
};

// Get provider by ID (public)
exports.getProviderById = async (req, res, next) => {
    try {
        const { providerId } = req.params;

        const provider = await Provider.findByPk(providerId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] },
                },
                { model: Service, as: 'services', required: false },
                { model: Certificate, as: 'certificates', required: false },
            ],
        });

        if (!provider) {
            return errorResponse(res, 'Provider not found.', 404);
        }

        return successResponse(res, serializeProvider(provider), 'Provider retrieved successfully');
    } catch (error) {
        console.error('Provider getProviderById error:', error);
        return next(error);
    }
};

// Get my provider profile (provider only)
exports.getMyProfile = async (req, res, next) => {
    try {
        const provider = await Provider.findOne({
            where: { userId: req.user.userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] },
                },
                { model: Service, as: 'services', required: false },
                { model: Certificate, as: 'certificates', required: false },
            ],
        });

        if (!provider) {
            return errorResponse(res, 'Provider profile not found.', 404);
        }

        return successResponse(res, serializeProvider(provider), 'Provider profile retrieved successfully');
    } catch (error) {
        console.error('Provider getMyProfile error:', error);
        return next(error);
    }
};

// Update provider profile (provider only)
exports.updateProfile = async (req, res, next) => {
    try {
        const { experience_years, specialization, phone, email } = req.body;

        const provider = await Provider.findOne({
            where: { userId: req.user.userId },
            include: [{ model: User, as: 'user' }]
        });

        if (!provider) {
            return errorResponse(res, 'Provider profile not found.', 404);
        }

        // Update provider-specific fields
        const providerUpdates = {};
        if (experience_years !== undefined) providerUpdates.experienceYears = experience_years;
        if (specialization !== undefined) providerUpdates.specialization = specialization;

        if (Object.keys(providerUpdates).length > 0) {
            await provider.update(providerUpdates);
        }

        // Update user table fields (phone, email)
        const userUpdates = {};
        if (phone !== undefined) userUpdates.phone = phone;
        if (email !== undefined) userUpdates.email = email;

        if (Object.keys(userUpdates).length > 0) {
            await User.update(userUpdates, { where: { userId: req.user.userId } });
        }

        // Reload to get updated data
        await provider.reload();

        return successResponse(res, serializeProvider(provider), 'Provider profile updated successfully');
    } catch (error) {
        return next(error);
    }
};
