const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define(
    'Admin',
    {
        adminId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'admin_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
    },
    {
        tableName: 'admin',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Admin;
