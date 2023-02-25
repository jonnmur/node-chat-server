const User = require('../models/User');
const Message = require('../models/Message');
const Joi = require('joi');

const createSchema = Joi.object({
    body: Joi.string().trim().required(),
});

const index = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    try {
        const messages = await Message.findAll({ include: User });
        return res.send(messages);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const show = async (req, res) => {
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

const create = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    const { error, value } = createSchema.validate(req.body.trim());

    if (error) {
        return res.status(422).json(error.details);
    }

    try {
        const message = await Message.create({ body: req.body.body, user_id: req.user.id}, { include: User });
        return res.send(message);
    } catch {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    index,
    show,
    create,
}