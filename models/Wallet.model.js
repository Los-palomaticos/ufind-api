const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')

const Wallet = sequelize.define('Wallet', {
    ucoins : {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Wallet
