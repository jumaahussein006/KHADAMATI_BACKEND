const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: isProduction ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        define: {
            freezeTableName: true,
            timestamps: false,
        }
    })
    : new Sequelize(
        process.env.DB_NAME || 'khadamati',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            define: {
                freezeTableName: true,
                timestamps: false,
            },
        }
    );

module.exports = sequelize;
