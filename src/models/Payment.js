const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
    'Payment',
    {
        paymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'payment_id',
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'request_id',
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'amount',
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            allowNull: true,
            defaultValue: 'pending',
            field: 'status',
        },
        method: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'method',
        },
        transactionDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'transaction_date',
        },
        getawayResponse: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'getaway_response',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'payment',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Payment;
