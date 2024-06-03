'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            conversationId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Conversations', // Name of the conversations table
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users', // Name of the users table
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            unread: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true // Mặc định là true khi tạo mới tin nhắn
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
        await queryInterface.dropTable('Messages');
    }
};
