const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(
    process.env.DB_NAME || 'test',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
{
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
});
const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


module.exports = {sequelize, connect}