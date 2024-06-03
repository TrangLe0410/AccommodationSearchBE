'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            postId: {
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING
            },
            lastUpdate: {
                type: Sequelize.STRING
            },
            rate: {
                type: Sequelize.STRING
            },
            hidden: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Comments');
    }
};