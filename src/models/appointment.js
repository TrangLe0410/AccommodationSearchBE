'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Appointment.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
            Appointment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    Appointment.init({
        appointmentRequesterID: DataTypes.STRING,
        posterId: DataTypes.STRING,
        postId: DataTypes.STRING,
        appointmentDate: DataTypes.DATE,
        appointmentTime: DataTypes.TIME,
        content: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Canceled'),
            defaultValue: 'Pending'
        },



    }, {
        sequelize,
        modelName: 'Appointment',
    });
    return Appointment;
};