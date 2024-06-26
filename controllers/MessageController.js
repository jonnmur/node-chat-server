import { User } from '../models/User.js';
import { Message } from'../models/Message.js';
import Joi from 'joi';

const createSchema = Joi.object({
    body: Joi.string().trim().required(),
});

export const index = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    try {
        const messages = await Message.findAll({
            include: User,
            limit: req.query.limit ? parseInt(req.query.limit) : null,
            offset: req.query.offset ? parseInt(req.query.offset) : null,
            order: [
                ['created_at', 'DESC']
            ]
        });

        return res.send(messages.reverse());
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

export const show = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }
    
    try {
        const message = await Message.findByPk(req.params.id, { include: User });
        return res.send(message);
    } catch {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

export const create = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    const { error, value } = createSchema.validate(req.body);

    if (error) {
        return res.status(422).json(error.details);
    }

    try {
        const message = await Message.create(
            {
                body: req.body.body.trim(),
                user_id: req.user.id,
            },
        );

        message.get().User = req.user;

        req.app.get('io').emit('newMessage', message);

        return res.status(201).json( { message });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Something went wrong' });
    }
}
