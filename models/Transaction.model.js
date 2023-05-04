const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')

const Transaction = sequelize.define('Transaction', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Transaction