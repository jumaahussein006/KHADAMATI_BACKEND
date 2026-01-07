// Comprehensive diagnostic script to find the server crash cause
console.log('=== KHADAMATI SERVER DIAGNOSTIC ===\n');

// Step 1: Test environment variables
console.log('[1/6] Testing environment variables...');
require('dotenv').config();
console.log('✓ Environment loaded');
console.log(`  - DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
console.log(`  - DB_NAME: ${process.env.DB_NAME || 'NOT SET'}`);
console.log(`  - DB_USER: ${process.env.DB_USER || 'NOT SET'}`);
console.log(`  - PORT: ${process.env.PORT || 'NOT SET'}\n`);

// Step 2: Test database connection
console.log('[2/6] Testing database connection...');
const sequelize = require('./src/config/database');

sequelize.authenticate()
    .then(() => {
        console.log('✓ Database connection successful\n');

        // Step 3: Test individual model loading
        console.log('[3/6] Testing model loading...');
        try {
            console.log('  Loading User model...');
            const User = require('./src/models/User');
            console.log('  ✓ User model loaded');

            console.log('  Loading Admin model...');
            const Admin = require('./src/models/Admin');
            console.log('  ✓ Admin model loaded');

            console.log('  Loading Customer model...');
            const Customer = require('./src/models/Customer');
            console.log('  ✓ Customer model loaded');

            console.log('  Loading Provider model...');
            const Provider = require('./src/models/Provider');
            console.log('  ✓ Provider model loaded');

            console.log('  Loading Category model...');
            const Category = require('./src/models/Category');
            console.log('  ✓ Category model loaded');

            console.log('  Loading Service model...');
            const Service = require('./src/models/Service');
            console.log('  ✓ Service model loaded');

            console.log('  Loading ServiceRequest model...');
            const ServiceRequest = require('./src/models/ServiceRequest');
            console.log('  ✓ ServiceRequest model loaded');

            console.log('  Loading Payment model...');
            const Payment = require('./src/models/Payment');
            console.log('  ✓ Payment model loaded');

            console.log('\n[4/6] Testing models/index.js (with associations)...');
            const models = require('./src/models');
            console.log('✓ All models and associations loaded\n');

            // Step 5: Test app.js loading
            console.log('[5/6] Testing app.js loading...');
            const app = require('./src/app');
            console.log('✓ App loaded successfully\n');

            // Step 6: Test a simple query
            console.log('[6/6] Testing database query...');
            return models.User.count();
        } catch (error) {
            console.error('\n✗ ERROR during model/app loading:');
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            process.exit(1);
        }
    })
    .then((userCount) => {
        console.log(`✓ Query successful: ${userCount} users in database\n`);
        console.log('=== ALL DIAGNOSTICS PASSED ===');
        console.log('The server should be able to start normally.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n✗ DIAGNOSTIC FAILED:');
        console.error('Error:', error.message);
        if (error.original) {
            console.error('Original Error:', error.original.message);
            console.error('SQL Error Code:', error.original.code);
        }
        console.error('\nFull Stack:', error.stack);

        // Provide helpful hints
        console.error('\n=== TROUBLESHOOTING HINTS ===');
        if (error.message.includes('ECONNREFUSED') || error.original?.code === 'ECONNREFUSED') {
            console.error('→ MySQL server is not running. Start MySQL/MariaDB service.');
        } else if (error.message.includes('ER_ACCESS_DENIED')) {
            console.error('→ Database credentials are incorrect. Check .env file.');
        } else if (error.message.includes('ER_BAD_DB_ERROR')) {
            console.error('→ Database "khadamati" does not exist. Import khadamati.sql first.');
        }

        process.exit(1);
    });
