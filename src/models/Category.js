const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
    'Category',
    {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        icon: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'icon',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'category',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Category;
