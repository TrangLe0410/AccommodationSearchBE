'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Post.belongsTo(models.Image, { foreignKey: 'imagesId', targetKey: 'id', as: 'images' })
            Post.belongsTo(models.Attribute, { foreignKey: 'attributesId', targetKey: 'id', as: 'attributes' })
            Post.belongsTo(models.Overview, { foreignKey: 'overviewId', targetKey: 'id', as: 'overviews' })
            Post.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' })
            Post.belongsTo(models.Label, { foreignKey: 'labelCode', targetKey: 'code', as: 'labelData' })
            Post.hasMany(models.SavedPost, { foreignKey: 'postId', as: 'savedPosts' });
            // Post.belongsTo(models.Appointment, { foreignKey: 'appointmentId', targetKey: 'id', as: 'appointments' })
            Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });

        }
    }
    Post.init({
        title: DataTypes.STRING,
        star: DataTypes.STRING,
        address: DataTypes.STRING,
        labelCode: DataTypes.STRING,
        attributesId: DataTypes.STRING,
        categoryCode: DataTypes.STRING,
        description: DataTypes.TEXT,
        userId: DataTypes.STRING,
        overviewId: DataTypes.STRING,
        imagesId: DataTypes.STRING,
        priceCode: DataTypes.STRING,
        areaCode: DataTypes.STRING,
        provinceCode: DataTypes.STRING,
        priceNumber: DataTypes.FLOAT,
        areaNumber: DataTypes.FLOAT,
        video: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Canceled'),
            defaultValue: 'Approved'
        },
        visibility: {
            type: DataTypes.ENUM('Hidden', 'Visible'),
            defaultValue: 'Visible'
        }
    }, {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};