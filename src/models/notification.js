'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            // Định nghĩa quan hệ với bảng Appointment (nếu cần thiết)
            Notification.belongsTo(models.Appointment, {
                foreignKey: 'appointmentId',
                as: 'appointment' // Đặt tên cho quan hệ, bạn có thể thay đổi tên này nếu cần
            });
        }
    }
    Notification.init({
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        appointmentId: {
            type: DataTypes.STRING, // Thêm cột appointmentId để lưu id của lịch hẹn
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};
