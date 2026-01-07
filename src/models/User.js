const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
    'User',
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'user_id',
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'email',
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'password',
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'first_name',
        },
        middleName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'middle_name',
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'last_name',
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'phone',
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer', 'provider'),
            allowNull: false,
            defaultValue: 'customer',
            field: 'role',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'user',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = User;
