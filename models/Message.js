const db = require('../config/db');
const Sequelize = require('sequelize');

const Message = db.define('Message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    body: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'messages',
    timestamps: false,
});

module.exports = Message;