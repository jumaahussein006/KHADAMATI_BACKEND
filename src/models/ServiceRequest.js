const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceRequest = sequelize.define(
    'ServiceRequest',
    {
        requestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'request_id' },
        customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
        providerId: { type: DataTypes.INTEGER, allowNull: false, field: 'provider_id' },
        serviceId: { type: DataTypes.INTEGER, allowNull: false, field: 'service_id' },

        scheduledDate: { type: DataTypes.DATE, allowNull: true, field: 'scheduled_date' },
        details: { type: DataTypes.TEXT, allowNull: true, field: 'details' },
        problemType: { type: DataTypes.STRING(100), allowNull: true, field: 'problem_type' },
        requestDate: { type: DataTypes.DATE, allowNull: true, field: 'request_date' },

        price: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'price' },

        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'in_progress', 'on_the_way', 'completed', 'cancelled'),
            defaultValue: 'pending',
            allowNull: true,
            field: 'status',
        },
    },
    {
        tableName: 'servicerequest',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = ServiceRequest;
