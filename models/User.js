const db = require('../config/sequalize-config');
const Sequelize = require('sequelize');
const Message = require('./Message')

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    google_id: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    display_name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: { },
        }
    },
});

User.hasMany(Message, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
});

Message.belongsTo(User, { foreignKey: 'user_id' });

module.exports = User;
