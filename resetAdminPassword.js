/**
 * Reset Admin Password Script
 * 
 * This script will reset the admin password to 'admin123'
 * Run with: node resetAdminPassword.js
 */

const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('khadamati', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

async function resetAdminPassword() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Connected to database');

        // Hash the new password
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('✓ Generated password hash');

        // Update admin password
        await sequelize.query(
            'UPDATE user SET password = ? WHERE email = ?',
            {
                replacements: [hashedPassword, 'admin@khadamati.com'],
                type: Sequelize.QueryTypes.UPDATE
            }
        );

        console.log('✓ Admin password reset successfully');
        console.log('');
        console.log('You can now login with:');
        console.log('  Email: admin@khadamati.com');
        console.log('  Password: admin123');
        console.log('');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

resetAdminPassword();
