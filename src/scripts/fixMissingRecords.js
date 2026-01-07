/**
 * Script to fix missing customer/provider records
 * Run this script from the server directory: node src/scripts/fixMissingRecords.js
 */

require('dotenv').config();
const sequelize = require('../config/database');
const { User, Customer, Provider } = require('../models');

async function fixMissingRecords() {
    try {
        console.log('🔍 Checking for users with missing customer/provider records...\n');

        // Find all users
        const users = await User.findAll();

        let customersCreated = 0;
        let providersCreated = 0;
        let skipped = 0;

        for (const user of users) {
            if (user.role === 'customer') {
                const existingCustomer = await Customer.findOne({ where: { userId: user.userId } });

                if (!existingCustomer) {
                    await Customer.create({ userId: user.userId });
                    console.log(`✅ Created customer record for user: ${user.email} (ID: ${user.userId})`);
                    customersCreated++;
                } else {
                    skipped++;
                }
            } else if (user.role === 'provider') {
                const existingProvider = await Provider.findOne({ where: { userId: user.userId } });

                if (!existingProvider) {
                    await Provider.create({
                        userId: user.userId,
                        experienceYears: 0,
                        rating: 0.0,
                        totalReviews: 0,
                        isVerified: false,
                    });
                    console.log(`✅ Created provider record for user: ${user.email} (ID: ${user.userId})`);
                    providersCreated++;
                } else {
                    skipped++;
                }
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   - Customer records created: ${customersCreated}`);
        console.log(`   - Provider records created: ${providersCreated}`);
        console.log(`   - Users already had records: ${skipped}`);
        console.log(`   - Total users processed: ${users.length}\n`);

        console.log('✅ Done! All users now have corresponding customer/provider records.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing records:', error);
        process.exit(1);
    }
}

fixMissingRecords();
