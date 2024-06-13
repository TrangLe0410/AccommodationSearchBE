const { Sequelize } = require('sequelize');
require('dotenv').config();
// Configure Sequelize with the correct host and port
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection database has been established successfully to host:', sequelize.options.host, 'on port:', sequelize.options.port);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


export default connectDatabase;
