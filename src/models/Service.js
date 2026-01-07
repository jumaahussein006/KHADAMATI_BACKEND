const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define(
    'Service',
    {
        serviceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'service_id',
        },
        providerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'provider_id',
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'category_id',
        },
        nameAr: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'name_ar',
        },
        nameEn: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'name_en',
        },
        descriptionAr: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description_ar',
        },
        descriptionEn: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description_en',
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            field: 'price',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'duration_minutes',
        },
    },
    {
        tableName: 'service',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Service;
