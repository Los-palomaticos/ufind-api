const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')
const Post = sequelize.define('Post', {
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complete: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            max: 2
        }
    }
});
module.exports = Post