const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define(
    'Notification',
    {
        notificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'notification_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'type',
        },
        titleAr: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'title_ar',
        },
        titleEn: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'title_en',
        },
        messageAr: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'message_ar',
        },
        messageEn: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'message_en',
        },
        relatedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'related_id',
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
            field: 'is_read',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'notification',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Notification;
