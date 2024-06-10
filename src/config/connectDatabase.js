const { Sequelize } = require('sequelize');

// Configure Sequelize with the correct host and port
const sequelize = new Sequelize('accommodation', 'root', '123456', {
    host: '52.62.89.174',  // Public IP address of your MySQL server
    port: 3306,  // Default MySQL port
    dialect: 'mysql',
    logging: false
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully to host:', sequelize.options.host, 'on port:', sequelize.options.port);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


export default connectDatabase;
