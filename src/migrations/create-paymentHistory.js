'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PaymentHistories', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            datetime_transaction: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            postId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            typePost: {
                type: Sequelize.STRING,
                allowNull: false
            },
            typeActive: {
                type: Sequelize.STRING,
                allowNull: false
            },
            money: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Chưa thanh toán'
            },
            paymentMethod: {
                type: Sequelize.STRING,
                allowNull: false
            },
            balanceBeforePayment: {  // New column for balance before payment
                type: Sequelize.FLOAT,
                defaultValue: '0'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addConstraint('PaymentHistories', {
            fields: ['userId'],
            type: 'foreign key',
            name: 'fk_paymentHistories_userId', // optional, but can be helpful for naming the constraint
            references: {
                table: 'Users',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PaymentHistories');
    }
};
