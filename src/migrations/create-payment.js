'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING // Thay đổi kiểu dữ liệu của cột id thành STRING
            },
            datetime_transaction: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            money: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            status_transaction: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            content_transaction: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sessionId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Payments');
    }
};
