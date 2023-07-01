const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/mysql.config')
const roles = require('../data/role.data')
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
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "https://res.cloudinary.com/dvbuu8u2x/image/upload/v1688187666/user_gpigol.png",
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
    },
    // Se piensa tener rol de usuario y de admin
    role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: roles.USER
    },
    // tokens para que pueda ser autenticado, duracion de 1 dia
    token: {
        type: DataTypes.TEXT
    }
},
{
    defaultScope: {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'password']
        }
    },
    scopes:{
        publisher: {
            attributes: ['username', 'id', 'reported', 'banned', 'email']
        },
        withPassword: {
            exclude: ['createdAt', 'updatedAt']
        }
    }
});

module.exports = User