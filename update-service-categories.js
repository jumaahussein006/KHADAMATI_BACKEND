require('dotenv').config();
const { Sequelize } = require('sequelize');

async function updateServiceCategoryIds() {
    console.log('🔄 Updating service category_id references...\n');

    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        // Mapping: old_id -> new_id
        const mapping = {
            13: 1, // Plumbing
            14: 2, // Electrical
            15: 3, // Cleaning
            16: 4, // Painting
            17: 5, // AC Repair
            18: 6  // Carpentry
        };

        console.log('📋 Category ID Mapping:');
        Object.entries(mapping).forEach(([oldId, newId]) => {
            console.log(`   ${oldId} -> ${newId}`);
        });
        console.log('');

        // Update each service
        for (const [oldId, newId] of Object.entries(mapping)) {
            const [result] = await sequelize.query(`
                UPDATE service 
                SET category_id = :newId 
                WHERE category_id = :oldId
            `, {
                replacements: { oldId, newId }
            });

            console.log(`✓ Updated services: category_id ${oldId} -> ${newId}`);
        }

        console.log('\n🎉 All services updated successfully!\n');

        // Verify
        const [services] = await sequelize.query(`
            SELECT s.service_id, s.name_en, s.category_id, c.name_en as category_name
            FROM service s
            LEFT JOIN category c ON s.category_id = c.category_id
            ORDER BY s.category_id, s.service_id
        `);

        console.log('📋 Updated services by category:');
        services.forEach(svc => {
            console.log(`   Service: ${svc.name_en} | Category ID: ${svc.category_id} (${svc.category_name || 'N/A'})`);
        });

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

updateServiceCategoryIds();
