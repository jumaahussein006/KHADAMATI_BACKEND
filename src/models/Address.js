const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define(
    'Address',
    {
        addressId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'address_id',
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'city',
        },

        street: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'street',
        },

        building: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'building',
        },

        floor: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'floor',
        },

        country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'country',
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'address',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Address;
