require('dotenv').config();
const { Sequelize } = require('sequelize');

async function checkServiceOne() {
    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    try {
        await sequelize.authenticate();

        const [services] = await sequelize.query(`
            SELECT s.service_id, s.name_en, s.category_id, c.name_en as category_name
            FROM service s
            LEFT JOIN category c ON s.category_id = c.category_id
            WHERE s.service_id = 1
        `);

        console.log('Service ID 1:');
        console.log(JSON.stringify(services[0], null, 2));

        if (!services[0] || !services[0].category_id) {
            console.log('\n❌ SERVICE 1 HAS NO CATEGORY_ID!');
            console.log('Fixing now...\n');

            await sequelize.query(`UPDATE service SET category_id = 2 WHERE service_id = 1`);
            console.log('✅ Fixed! Service 1 now has category_id = 2 (Electrical)');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkServiceOne();
