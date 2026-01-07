const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define(
    'Status',
    {
        statusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'status_id',
        },
        values: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'values',
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
    },
    {
        tableName: 'status',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Status;
