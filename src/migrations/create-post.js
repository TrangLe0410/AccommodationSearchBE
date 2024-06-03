'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            star: {
                type: Sequelize.STRING,
                defaultValue: '0'
            },
            address: {
                type: Sequelize.STRING
            },
            labelCode: {
                type: Sequelize.STRING
            },
            attributesId: {
                type: Sequelize.STRING
            },
            categoryCode: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            userId: {
                type: Sequelize.STRING
            },
            overviewId: {
                type: Sequelize.STRING
            },
            imagesId: {
                type: Sequelize.STRING
            },
            priceCode: {
                type: Sequelize.STRING
            },
            areaCode: {
                type: Sequelize.STRING
            },
            provinceCode: {
                type: Sequelize.STRING
            },
            priceNumber: {
                type: Sequelize.FLOAT
            },
            areaNumber: {
                type: Sequelize.FLOAT
            },
            status: {
                type: Sequelize.ENUM('Pending', 'Approved', 'Canceled'),
                defaultValue: 'Approved'
            },
            visibility: {
                type: Sequelize.ENUM('Hidden', 'Visible'),
                defaultValue: 'Visible'
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
        await queryInterface.dropTable('Posts');
    }
};