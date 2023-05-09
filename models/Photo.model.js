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
},
{
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'post_id'] },
    },
    scopes: {
        noId: {
            attributes: ['photo']
        }
    }
});

module.exports = Photo;
