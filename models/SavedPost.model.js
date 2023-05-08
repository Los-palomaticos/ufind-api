const { sequelize } = require('../config/mysql.config')

const SavedPost = sequelize.define('SavedPost', {
});

module.exports = SavedPost