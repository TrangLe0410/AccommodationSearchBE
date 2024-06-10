'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
            Conversation.belongsTo(models.User, { foreignKey: 'user1Id', as: 'user1', targetKey: 'id' });
            Conversation.belongsTo(models.User, { foreignKey: 'user2Id', as: 'user2', targetKey: 'id' });

        }
    }
    Conversation.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        user1Id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user2Id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Conversation',
    });
    return Conversation;
};
