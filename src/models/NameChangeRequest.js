const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NameChangeRequest = sequelize.define(
    'NameChangeRequest',
    {
        requestId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'request_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        oldFirstName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'old_first_name',
        },
        oldMiddleName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'old_middle_name',
        },
        oldLastName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'old_last_name',
        },
        newFirstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'new_first_name',
        },
        newMiddleName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'new_middle_name',
        },
        newLastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'new_last_name',
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: true,
            defaultValue: 'pending',
            field: 'status',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
        reviewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'reviewed_at',
        },
        reviewedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'reviewed_by',
        },
    },
    {
        tableName: 'namechangerequest',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = NameChangeRequest;
