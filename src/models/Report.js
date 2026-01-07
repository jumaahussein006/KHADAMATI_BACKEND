const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define(
    'Report',
    {
        reportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'report_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
            comment: 'User who created the report'
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'admin_id',
        },
        reportType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'report_type',
        },
        targetType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'target_type',
        },
        targetId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'target_id',
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'title',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'content',
        },
        adminReply: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'admin_reply',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'report',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Report;
