const { Category } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            attributes: ['categoryId', 'nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'icon', 'createdAt'],
            order: [['categoryId', 'DESC']]
        });

        const result = categories.map(cat => {
            const data = cat.toJSON();
            return {
                category_id: data.categoryId,
                name_ar: data.nameAr,
                name_en: data.nameEn,
                description_ar: data.descriptionAr,
                description_en: data.descriptionEn,
                icon: data.icon,
                created_at: data.createdAt
            };
        });

        return successResponse(res, result, 'Categories retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            attributes: ['categoryId', 'nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'icon', 'createdAt']
        });

        if (!category) {
            return errorResponse(res, 'Category not found.', 404);
        }

        const data = category.toJSON();
        const response = {
            category_id: data.categoryId,
            name_ar: data.nameAr,
            name_en: data.nameEn,
            description_ar: data.descriptionAr,
            description_en: data.descriptionEn,
            icon: data.icon,
            created_at: data.createdAt
        };

        return successResponse(res, response, 'Category retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Create category (admin only)
exports.createCategory = async (req, res, next) => {
    try {
        const { name_ar, name_en, description_ar, description_en, icon } = req.body;

        // Strict validation - reject if single-language fields present
        if (req.body.name || req.body.description) {
            return errorResponse(res, 'Invalid fields. Use name_ar/name_en and description_ar/description_en only.', 400);
        }

        // Validate required bilingual fields
        if (!name_ar || !name_en) {
            return errorResponse(res, 'Both name_ar and name_en are required.', 400);
        }

        const category = await Category.create({
            nameAr: name_ar,
            nameEn: name_en,
            descriptionAr: description_ar,
            descriptionEn: description_en,
            icon,
            createdAt: new Date()
        });

        const data = category.toJSON();
        const response = {
            category_id: data.categoryId,
            name_ar: data.nameAr,
            name_en: data.nameEn,
            description_ar: data.descriptionAr,
            description_en: data.descriptionEn,
            icon: data.icon,
            created_at: data.createdAt
        };

        return successResponse(res, response, 'Category created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Update category (admin only)
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name_ar, name_en, description_ar, description_en, icon } = req.body;

        // Strict validation - reject if single-language fields present
        if (req.body.name || req.body.description) {
            return errorResponse(res, 'Invalid fields. Use name_ar/name_en and description_ar/description_en only.', 400);
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return errorResponse(res, 'Category not found.', 404);
        }

        const updates = {};
        if (name_ar !== undefined) updates.nameAr = name_ar;
        if (name_en !== undefined) updates.nameEn = name_en;
        if (description_ar !== undefined) updates.descriptionAr = description_ar;
        if (description_en !== undefined) updates.descriptionEn = description_en;
        if (icon !== undefined) updates.icon = icon;

        await category.update(updates);

        const data = category.toJSON();
        const response = {
            category_id: data.categoryId,
            name_ar: data.nameAr,
            name_en: data.nameEn,
            description_ar: data.descriptionAr,
            description_en: data.descriptionEn,
            icon: data.icon,
            created_at: data.createdAt
        };

        return successResponse(res, response, 'Category updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return errorResponse(res, 'Category not found.', 404);
        }

        await category.destroy();
        return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
};
