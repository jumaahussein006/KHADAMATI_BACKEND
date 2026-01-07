const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define(
    'Review',
    {
        reviewId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'review_id',
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'request_id',
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'rating',
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'comment',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at',
        },
    },
    {
        tableName: 'review',
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Review;
