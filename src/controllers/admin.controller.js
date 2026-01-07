const { User, Customer, Provider, ServiceRequest, Payment, Report, Service } = require('../models');
const { successResponse } = require('../utils/response.util');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
    try {
        console.log('=== ADMIN STATS REQUEST ===');

        // Get totals
        const totalUsers = await User.count();
        const totalCustomers = await Customer.count();
        const totalProviders = await Provider.count();
        const totalRequests = await ServiceRequest.count();
        const totalServices = await Service.count();
        const totalReports = await Report.count();

        // Calculate total revenue from payments
        const payments = await Payment.findAll({ attributes: ['amount'] });
        const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        // Get data for last 6 months
        const monthlyData = [];
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59);

            const usersCount = await User.count({
                where: {
                    createdAt: {
                        [Op.between]: [monthStart, monthEnd]
                    }
                }
            });

            const requestsCount = await ServiceRequest.count({
                where: {
                    requestDate: {
                        [Op.between]: [monthStart, monthEnd]
                    }
                }
            });

            monthlyData.push({
                name: monthNames[monthStart.getMonth()],
                users: usersCount,
                requests: requestsCount
            });
        }

        const stats = {
            totals: {
                users: totalUsers,
                customers: totalCustomers,
                providers: totalProviders,
                requests: totalRequests,
                services: totalServices,
                revenue: totalRevenue,
                reports: totalReports
            },
            monthlyData
        };

        console.log('Stats response:', JSON.stringify(stats, null, 2));
        return successResponse(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
        console.error('=== ADMIN STATS ERROR ===');
        console.error('Error:', error);
        return next(error);
    }
};
