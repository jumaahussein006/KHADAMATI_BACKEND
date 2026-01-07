require('dotenv').config();
const { Category } = require('./src/models');

async function fetchCategories() {
    try {
        const categories = await Category.findAll();
        console.log(JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        process.exit();
    }
}

fetchCategories();
