// Test script to identify startup errors
console.log('Starting test...');

try {
    console.log('Loading dotenv...');
    require('dotenv').config();

    console.log('Loading app...');
    const app = require('./src/app');

    console.log('Loading sequelize...');
    const sequelize = require('./src/config/database');

    console.log('Testing DB connection...');
    sequelize.authenticate()
        .then(() => {
            console.log('✓ Database connection established successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('✗ Unable to connect to database:', error.message);
            console.error(error);
            process.exit(1);
        });
} catch (error) {
    console.error('✗ Error during startup:', error.message);
    console.error(error);
    process.exit(1);
}
