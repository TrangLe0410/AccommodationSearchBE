import { Sequelize } from 'sequelize';
import Conversation from './conversation.js';
import User from './user.js';
import Message from './message.js';

const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'mysql', // Hoặc SQLite, PostgreSQL, v.v.
});

const models = {
    Conversation: Conversation(sequelize, Sequelize.DataTypes),
    User: User(sequelize, Sequelize.DataTypes),
    Message: Message(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export default models;
