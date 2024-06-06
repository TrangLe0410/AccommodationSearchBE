'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }

    Payment.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => {
                const timestamp = Date.now().toString(); // Lấy thời gian hiện tại
                const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // Tạo số ngẫu nhiên 6 chữ số
                return timestamp + randomNum; // Kết hợp thời gian và số ngẫu nhiên
            },
            allowNull: false
        },
        datetime_transaction: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        money: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status_transaction: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        content_transaction: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Payment',
        hooks: {
            beforeCreate: (payment, options) => {
                const timestamp = Date.now().toString();
                const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                payment.id = timestamp + randomNum;
            }
        }
    });

    return Payment;
};
