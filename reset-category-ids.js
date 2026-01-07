require('dotenv').config();
const { Sequelize } = require('sequelize');

async function resetCategoryIds() {
    console.log('🔄 Resetting category IDs to auto-increment from 1...\n');

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
        console.log('✓ Connected to Railway PostgreSQL\n');

        // Step 1: Delete all existing categories
        console.log('🗑️  Step 1: Deleting all existing categories...');
        await sequelize.query('DELETE FROM category;');
        console.log('✓ Categories deleted\n');

        // Step 2: Reset the auto-increment sequence to start from 1
        console.log('🔄 Step 2: Resetting category_id sequence to 1...');
        await sequelize.query('ALTER SEQUENCE category_category_id_seq RESTART WITH 1;');
        console.log('✓ Sequence reset\n');

        // Step 3: Insert 6 categories (will get IDs 1-6)
        console.log('➕ Step 3: Inserting 6 categories (IDs will be 1-6)...\n');

        const categories = [
            ['سباكة', 'Plumbing', 'خدمات السباكة', 'Plumbing services', '🔧'],
            ['كهرباء', 'Electrical', 'خدمات الكهرباء', 'Electrical services', '⚡'],
            ['تنظيف', 'Cleaning', 'خدمات التنظيف', 'Cleaning services', '🧹'],
            ['دهان', 'Painting', 'خدمات الدهان', 'Painting services', '🎨'],
            ['تصليح مكيفات', 'AC Repair', 'خدمات تصليح المكيفات', 'AC Repair services', '❄️'],
            ['نجارة', 'Carpentry', 'خدمات النجارة', 'Carpentry services', '🪵']
        ];

        for (let i = 0; i < categories.length; i++) {
            const [nameAr, nameEn, descAr, descEn, icon] = categories[i];
            await sequelize.query(`
                INSERT INTO category (name_ar, name_en, description_ar, description_en, icon, created_at)
                VALUES (:nameAr, :nameEn, :descAr, :descEn, :icon, CURRENT_TIMESTAMP)
            `, {
                replacements: { nameAr, nameEn, descAr, descEn, icon }
            });
            console.log(`✓ Added: ${nameEn} (${nameAr}) - will be ID ${i + 1}`);
        }

        console.log('\n🎉 Category IDs reset successfully! IDs are now 1-6.\n');

        // Verify
        const [result] = await sequelize.query(
            `SELECT category_id, name_en, name_ar FROM category ORDER BY category_id`
        );

        console.log('📋 Current categories:');
        result.forEach((cat) => {
            console.log(`   ID ${cat.category_id}: ${cat.name_en} (${cat.name_ar})`);
        });

        console.log('\n✅ DONE! Categories now have IDs 1-6.');
        console.log('⚠️  IMPORTANT: Update services table if any services reference old category IDs!\n');

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

resetCategoryIds();
