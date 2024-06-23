'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
      User.hasMany(models.Appointment, { foreignKey: 'userId', as: 'appointments' });
      User.hasMany(models.SavedPost, { foreignKey: 'userId', as: 'savedPosts' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    fbUrl: DataTypes.STRING,
    zalo: DataTypes.STRING,
    address: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'user', 'moderator'), // Thay đổi giá trị ENUM tùy theo nhu cầu của bạn
      allowNull: false,
      defaultValue: 'user' // Giá trị mặc định là 'user'
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'locked'),
      defaultValue: 'active',
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};