const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')
const Post = sequelize.define('Post', {
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    post_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
    },
    locationDescription: {
        type: DataTypes.TEXT,
    },
    complete: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            max: 2
        }
    },
    reported: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    }
},
{
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    }
});
module.exports = Post