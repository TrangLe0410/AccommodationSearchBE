'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Conversations', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            user1Id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users', // Ensure this matches exactly with the table name in your Users migration
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            user2Id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users', // Ensure this matches exactly with the table name in your Users migration
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Conversations');
    }
};