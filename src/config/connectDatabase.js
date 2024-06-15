import { Sequelize } from 'sequelize';

// Cấu hình Sequelize
const sequelize = new Sequelize('verceldb', 'default', '6uPgnZfrYzq4', {
    host: 'ep-royal-brook-a4ppe4x7.us-east-1.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Hàm kết nối cơ sở dữ liệu
const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDatabase;
