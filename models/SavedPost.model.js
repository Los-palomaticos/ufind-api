const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql.config')

const SavedPost = sequelize.define('SavedPost', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: "id",
            model:"Post"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key:"id",
            model:"User"
        }
    }
});

module.exports = SavedPost