'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Appointments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            appointmentRequesterID: {
                type: Sequelize.STRING
            },
            posterId: {
                type: Sequelize.STRING
            },
            postId: {
                type: Sequelize.STRING
            },
            appointmentDate: {
                type: Sequelize.DATE
            },
            appointmentTime: {
                type: Sequelize.TIME
            },
            status: {
                type: Sequelize.ENUM('Pending', 'Approved', 'Canceled'),
                defaultValue: 'Pending'
            },
            content: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Appointments');
    }
};