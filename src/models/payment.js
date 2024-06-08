'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
                const timestamp = Date.now().toString();
                const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                return timestamp + randomNum;
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
