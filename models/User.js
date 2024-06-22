import { sequelize as db } from '../config/sequalize-config.js';

import Sequelize from 'sequelize';
import { Message } from './Message.js';

export const User = db.define('User', {
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
