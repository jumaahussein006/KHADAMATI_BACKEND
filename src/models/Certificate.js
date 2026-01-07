const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define(
    'Certificate',
    {
        certificateId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'certificate_id',
        },
        providerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'provider_id',
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'image',
        },
        issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'issue_date',
        },
    },
    {
        tableName: 'certificate',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Certificate;
