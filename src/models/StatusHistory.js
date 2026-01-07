const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StatusHistory = sequelize.define(
    'StatusHistory',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id',
        },
        serviceRequestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'service_request_id',
        },
        oldStatusId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'old_status_id',
        },
        newStatusId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'new_status_id',
        },
        changedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'changed_by',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'status_history',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = StatusHistory;
