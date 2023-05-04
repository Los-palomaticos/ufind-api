const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isAlphanumeric: true
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATEONLY,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user.png",
        validate: {
            isUrl: true
        }
    },
    email_backup: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    email_visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    profile_visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    institution: {
        type: DataTypes.STRING(100)
    },
    reported: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User