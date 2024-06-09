'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'conversation' });
            Message.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Message.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        conversationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        unread: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // Mặc định là true khi tạo mới tin nhắn
        },

    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};
export default Message;