const {sequelize} = require('../config/mysql.config')
const {DataTypes} = require('sequelize')

const Photo = sequelize.define('Photo', {
    photo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
});

module.exports = Photo;
