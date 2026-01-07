require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
    console.log('🌱 Seeding Railway PostgreSQL database...\n');

    // Use DATABASE_URL from .env or hardcoded Railway connection
    const databaseUrl = process.env.DATABASE_URL ||
        'postgresql://postgres:KXuAwdEuETvfGhePjOpMVvaCRjVOIGHM@centerbeam.proxy.rlwy.net:50888/railway';

    // Connect to Railway Postgres
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
        // Test connection
        await sequelize.authenticate();
        console.log('✓ Connected to Railway PostgreSQL\n');

        // Read SQL file
        const sqlFile = path.join(__dirname, 'database', 'seed-railway-postgres.sql');
        let sql = fs.readFileSync(sqlFile, 'utf8');

        // Remove comments and split into statements
        sql = sql.replace(/--.*$/gm, ''); // Remove single-line comments
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('/*'));

        console.log(`📝 Executing ${statements.length} SQL statements...\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.toLowerCase().includes('insert into')) {
                try {
                    await sequelize.query(statement + ';');
                    const tableName = statement.match(/INSERT INTO ["]?(\w+)["]?/i)[1];
                    console.log(`✓ Inserted data into "${tableName}"`);
                } catch (error) {
                    // Ignore duplicate key errors
                    if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
                        console.log(`  ℹ️  Data already exists (skipped)`);
                    } else {
                        console.error(`  ✗ Error: ${error.message}`);
                    }
                }
            }
        }

        console.log('\n🎉 Database seeding completed!\n');

        // Verify data
        console.log('Verifying data...\n');

        const [adminUsers] = await sequelize.query(
            `SELECT email, first_name, last_name, role FROM "user" WHERE role = 'admin'`
        );
        console.log(`✓ Admin users: ${adminUsers.length}`);
        if (adminUsers.length > 0) {
            console.log(`  - ${adminUsers[0].email}`);
        }

        const [categories] = await sequelize.query(
            `SELECT category_id, name_en, name_ar FROM category ORDER BY category_id`
        );
        console.log(`✓ Categories: ${categories.length}`);
        categories.slice(0, 5).forEach(cat => {
            console.log(`  - ${cat.name_en} (${cat.name_ar})`);
        });
        if (categories.length > 5) {
            console.log(`  ... and ${categories.length - 5} more`);
        }

        console.log('\n✅ All done! You can now login with:');
        console.log('   Email: admin@khadamati.com');
        console.log('   Password: admin123\n');

    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

seedDatabase();
