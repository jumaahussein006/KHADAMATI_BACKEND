require('dotenv').config();
const { Sequelize } = require('sequelize');

async function addAddressColumn() {
    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // Add address column to servicerequest table
        await sequelize.query('ALTER TABLE servicerequest ADD COLUMN IF NOT EXISTS address VARCHAR(255);');
        console.log('Column "address" added successfully (or already exists).');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

addAddressColumn();
