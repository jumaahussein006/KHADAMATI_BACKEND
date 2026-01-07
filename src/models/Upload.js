const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Upload = sequelize.define(
    'Upload',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        relatedType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'related_type',
        },
        relatedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'related_id',
        },
        filePath: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'file_path',
        },
        fileType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'file_type',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'uploads',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Upload;
