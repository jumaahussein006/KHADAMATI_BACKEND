const { Service, ServiceImage, Provider, Category, User, Customer } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');
const { Op } = require('sequelize');

// Get all services with filtering and pagination
exports.getAllServices = async (req, res, next) => {
    try {
        const { category_id, provider_id, search, page = 1, limit = 10 } = req.query;
        const where = {};

        if (category_id) where.categoryId = category_id;
        if (provider_id) where.providerId = provider_id;

        if (search) {
            where[Op.or] = [
                { nameAr: { [Op.like]: `%${search}%` } },
                { nameEn: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Service.findAndCountAll({
            where,
            include: [
                {
                    model: ServiceImage,
                    as: 'images',
                    attributes: ['imageId', 'image', 'caption']
                },
                {
                    model: Provider,
                    as: 'provider',
                    attributes: ['providerId', 'experienceYears', 'rating', 'totalReviews'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['userId', 'firstName', 'lastName', 'email', 'phone']
                    }]
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['categoryId', 'nameAr', 'nameEn', 'icon']
                }
            ],
            attributes: ['serviceId', 'providerId', 'categoryId', 'nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'price', 'durationMinutes', 'createdAt'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return paginatedResponse(res, rows, page, limit, count, 'Services retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get service by ID
exports.getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id, {
            include: [
                {
                    model: ServiceImage,
                    as: 'images',
                    attributes: ['imageId', 'image', 'caption']
                },
                {
                    model: Provider,
                    as: 'provider',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['userId', 'firstName', 'lastName', 'email', 'phone']
                    }]
                },
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });

        if (!service) {
            return errorResponse(res, 'Service not found.', 404);
        }

        return successResponse(res, service, 'Service retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get services by provider ID
exports.getServicesByProvider = async (req, res, next) => {
    try {
        const { providerId } = req.params;

        const services = await Service.findAll({
            where: { providerId },
            include: [
                {
                    model: ServiceImage,
                    as: 'images'
                },
                {
                    model: Category,
                    as: 'category'
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return successResponse(res, services, 'Services retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Create service (provider only)
exports.createService = async (req, res, next) => {
    try {
        const { name_ar, name_en, description_ar, description_en, price, duration_minutes } = req.body;

        // Validation
        if (req.body.name || req.body.description || req.body.title) {
            return errorResponse(res, 'Invalid fields. Use name_ar/name_en and description_ar/description_en only.', 400);
        }

        if (!name_ar || !name_en || !price) {
            return errorResponse(res, 'name_ar, name_en, and price are required.', 400);
        }

        const provider = await Provider.findOne({
            where: { userId: req.user.userId },
            include: [{ model: Category, as: 'categories' }]
        });

        if (!provider) {
            return errorResponse(res, 'Provider profile not found.', 404);
        }

        // Get category from provider's categories (use first category if multiple)
        let categoryId = null;
        if (provider.categories && provider.categories.length > 0) {
            categoryId = provider.categories[0].categoryId;
        }

        const service = await Service.create({
            providerId: provider.providerId,
            categoryId: categoryId,
            nameAr: name_ar,
            nameEn: name_en,
            descriptionAr: description_ar,
            descriptionEn: description_en,
            price,
            durationMinutes: duration_minutes,
            createdAt: new Date()
        });

        console.log('[CREATE SERVICE] Service created:', service.serviceId);
        console.log('[CREATE SERVICE] req.files:', req.files);
        console.log('[CREATE SERVICE] Files count:', req.files ? req.files.length : 0);

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            console.log('[CREATE SERVICE] Processing', req.files.length, 'image(s)');
            const images = req.files.map((file) => ({
                serviceId: service.serviceId,
                providerId: provider.providerId,
                image: `/uploads/${file.filename}`,
                caption: null,
                createdAt: new Date()
            }));
            console.log('[CREATE SERVICE] Image records to create:', JSON.stringify(images, null, 2));
            const createdImages = await ServiceImage.bulkCreate(images);
            console.log('[CREATE SERVICE] Images saved to DB:', createdImages.length);
        } else {
            console.log('[CREATE SERVICE] No files to upload');
        }

        const createdService = await Service.findByPk(service.serviceId, {
            include: [{ model: ServiceImage, as: 'images' }]
        });

        return successResponse(res, createdService, 'Service created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Update service
exports.updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name_ar, name_en, description_ar, description_en, price, duration_minutes } = req.body;

        if (req.body.name || req.body.description || req.body.title) {
            return errorResponse(res, 'Invalid fields. Use name_ar/name_en and description_ar/description_en only.', 400);
        }

        const service = await Service.findByPk(id);
        if (!service) {
            return errorResponse(res, 'Service not found.', 404);
        }

        const provider = await Provider.findOne({ where: { userId: req.user.userId } });

        if (service.providerId !== provider?.providerId && req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized to update this service.', 403);
        }

        const updates = {};
        if (name_ar !== undefined) updates.nameAr = name_ar;
        if (name_en !== undefined) updates.nameEn = name_en;
        if (description_ar !== undefined) updates.descriptionAr = description_ar;
        if (description_en !== undefined) updates.descriptionEn = description_en;
        if (price !== undefined) updates.price = price;
        if (duration_minutes !== undefined) updates.durationMinutes = duration_minutes;

        await service.update(updates);

        const updatedService = await Service.findByPk(id, {
            include: [{ model: ServiceImage, as: 'images' }]
        });

        return successResponse(res, updatedService, 'Service updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete service
exports.deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id);
        if (!service) {
            return errorResponse(res, 'Service not found.', 404);
        }

        const provider = await Provider.findOne({ where: { userId: req.user.userId } });

        if (service.providerId !== provider?.providerId && req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized to delete this service.', 403);
        }

        await service.destroy();
        return successResponse(res, null, 'Service deleted successfully');
    } catch (error) {
        next(error);
    }
};

// Search services by category and/or location
exports.searchServices = async (req, res, next) => {
    try {
        const { category_id, city, search, page = 1, limit = 20 } = req.query;

        const where = {};
        const providerWhere = {};

        // Filter by category
        if (category_id) {
            where.categoryId = category_id;
        }

        // Filter by service name (Arabic or English)
        if (search) {
            where[Op.or] = [
                { nameAr: { [Op.like]: `%${search}%` } },
                { nameEn: { [Op.like]: `%${search}%` } },
                { descriptionAr: { [Op.like]: `%${search}%` } },
                { descriptionEn: { [Op.like]: `%${search}%` } },
            ];
        }

        const offset = (page - 1) * limit;

        // Build includes with address filtering if city provided
        const includes = [
            {
                model: ServiceImage,
                as: 'images',
                attributes: ['imageId', 'image', 'caption'],
            },
            {
                model: Provider,
                as: 'provider',
                where: providerWhere,
                attributes: ['providerId', 'experienceYears', 'rating', 'totalReviews', 'isVerified'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
                    },
                ],
            },
            {
                model: Category,
                as: 'category',
                attributes: ['categoryId', 'nameAr', 'nameEn', 'icon'],
            },
        ];

        // If city provided, filter by provider's user address
        if (city) {
            const { Address } = require('../models');
            // Find providers in that city
            const providersInCity = await Address.findAll({
                where: { city: { [Op.like]: `%${city}%` } },
                attributes: ['userId'],
                distinct: true,
            });

            const userIdsInCity = providersInCity.map((addr) => addr.userId);
            if (userIdsInCity.length > 0) {
                // Add user filter to provider include
                includes[1].include[0].where = {
                    userId: { [Op.in]: userIdsInCity },
                };
            } else {
                // No providers in this city
                return paginatedResponse(res, [], page, limit, 0, 'No services found in this location');
            }
        }

        const { count, rows } = await Service.findAndCountAll({
            where,
            include: includes,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true,
        });

        return paginatedResponse(
            res,
            rows,
            page,
            limit,
            count,
            'Services found successfully'
        );
    } catch (error) {
        next(error);
    }
};