const db = require('../config/db');
const Sequelize = require('sequelize');
const Message = require('./Message')

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'users',
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: { },
        }
    }
});

User.hasMany(Message, {
    foreignKey: "user_id",
    onDelete: "cascade",
  });
  
Message.belongsTo(User, { foreignKey: "user_id" });

module.exports = User;