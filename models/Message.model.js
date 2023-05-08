const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')

const Message = sequelize.define('Message', {
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
module.exports = Message