const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('khadamati', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const ServiceImage = sequelize.define('ServiceImage', {
    imageId: { type: DataTypes.INTEGER, primaryKey: true, field: 'image_id' },
    image: DataTypes.STRING
}, { tableName: 'serviceimage', timestamps: false });

const Certificate = sequelize.define('Certificate', {
    certificateId: { type: DataTypes.INTEGER, primaryKey: true, field: 'certificate_id' },
    image: DataTypes.STRING
}, { tableName: 'certificate', timestamps: false });

async function run() {
    try {
        const serviceImages = await ServiceImage.findAll({ limit: 10 });
        console.log('--- SERVICE IMAGES ---');
        serviceImages.forEach(img => console.log(img.image));

        const certificates = await Certificate.findAll({ limit: 10 });
        console.log('\n--- CERTIFICATES ---');
        certificates.forEach(cert => console.log(cert.image));
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

run();
