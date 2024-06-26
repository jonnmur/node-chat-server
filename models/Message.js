import { sequelize as db } from '../config/sequalize-config.js';
import Sequelize from 'sequelize';

export const Message = db.define('Message', {
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
