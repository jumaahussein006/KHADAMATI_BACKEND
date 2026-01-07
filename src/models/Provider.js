const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Provider = sequelize.define(
    'Provider',
    {
        providerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'provider_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        experienceYears: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'experience_years',
        },
        specialization: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'specialization',
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            field: 'rating',
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'total_reviews',
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
            field: 'is_verified',
        },
        verificationDocument: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'verification_document',
        },
    },
    {
        tableName: 'provider',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Provider;
