'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PaymentHistory extends Model {
        static associate(models) {
            PaymentHistory.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

        }
    }

    PaymentHistory.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => {
                const timestamp = Date.now().toString();
                const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                return timestamp + randomNum;
            },
            allowNull: false
        },
        datetime_transaction: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typePost: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeActive: {
            type: DataTypes.STRING,
            allowNull: false
        },
        money: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Chưa thanh toán', // default status to unpaid
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balanceBeforePayment: {  // New column for balance before payment
            type: DataTypes.FLOAT,
            defaultValue: '0',
        },
    }, {
        sequelize,
        modelName: 'PaymentHistory',
        hooks: {
            beforeCreate: (paymentHistory, options) => {
                if (!paymentHistory.id) {
                    const timestamp = Date.now().toString();
                    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                    paymentHistory.id = timestamp + randomNum;
                }
            }
        }
    });

    return PaymentHistory;
};
