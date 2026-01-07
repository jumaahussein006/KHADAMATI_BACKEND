require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connection established successfully');

        const doSync = String(process.env.DB_SYNC).toLowerCase() === 'true';
        if (doSync) {
            const force = String(process.env.DB_SYNC_FORCE).toLowerCase() === 'true';
            await sequelize.sync({ force, alter: false });
            console.log(`✓ Database synchronized (force=${force})`);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(60));
            console.log(`✓ Server running on all interfaces at port ${PORT}`);
            console.log(`✓ Access from computer: http://localhost:${PORT}`);
            console.log(`✓ Access from mobile:   http://192.168.0.108:${PORT}`);
            console.log('='.repeat(60));
        });
    } catch (error) {
        console.error('✗ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();
