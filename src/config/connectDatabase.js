import { Sequelize } from 'sequelize';

// Cấu hình Sequelize
const sequelize = new Sequelize('railway', 'root', 'gmnWYBmPrvZMIzqbBbNelTeShWfHXfxI', {
    host: 'monorail.proxy.rlwy.net',
    dialect: 'mysql',
    port: 56109,

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
