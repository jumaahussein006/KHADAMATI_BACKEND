const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceImage = sequelize.define(
    'ServiceImage',
    {
        imageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'image_id',
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'service_id',
        },
        providerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'provider_id',
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'image',
        },
        caption: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'caption',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'serviceimage',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = ServiceImage;
