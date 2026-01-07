require('dotenv').config();
const { Sequelize } = require('sequelize');

async function updateCategories() {
    console.log('🔄 Updating categories in Railway PostgreSQL...\n');

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
        console.log('✓ Connected to Railway PostgreSQL\n');

        // Delete all existing categories
        console.log('🗑️  Deleting old categories...');
        await sequelize.query('DELETE FROM category;');
        console.log('✓ Old categories deleted\n');

        // Insert new 6 categories
        console.log('➕ Inserting 6 new categories...\n');

        const categories = [
            ['سباكة', 'Plumbing', 'خدمات السباكة', 'Plumbing services', '🔧'],
            ['كهرباء', 'Electrical', 'خدمات الكهرباء', 'Electrical services', '⚡'],
            ['تنظيف', 'Cleaning', 'خدمات التنظيف', 'Cleaning services', '🧹'],
            ['دهان', 'Painting', 'خدمات الدهان', 'Painting services', '🎨'],
            ['تصليح مكيفات', 'AC Repair', 'خدمات تصليح المكيفات', 'AC Repair services', '❄️'],
            ['نجارة', 'Carpentry', 'خدمات النجارة', 'Carpentry services', '🪵']
        ];

        for (const [nameAr, nameEn, descAr, descEn, icon] of categories) {
            await sequelize.query(`
                INSERT INTO category (name_ar, name_en, description_ar, description_en, icon, created_at)
                VALUES (:nameAr, :nameEn, :descAr, :descEn, :icon, CURRENT_TIMESTAMP)
            `, {
                replacements: { nameAr, nameEn, descAr, descEn, icon }
            });
            console.log(`✓ Added: ${nameEn} (${nameAr})`);
        }

        console.log('\n🎉 Categories updated successfully!\n');

        // Verify
        const [result] = await sequelize.query(
            `SELECT category_id, name_en, name_ar FROM category ORDER BY category_id`
        );

        console.log('📋 Current categories:');
        result.forEach((cat, index) => {
            console.log(`   ${index + 1}. ${cat.name_en} (${cat.name_ar})`);
        });

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

updateCategories();
