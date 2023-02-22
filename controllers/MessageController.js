const User = require('../models/User');
const Message = require('../models/Message');

const index = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json();
    }

    try {
        const messages = await Message.findAll({ include: User });
        res.send(messages);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const show = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json();
    }
    try {
        const message = await Message.findByPk(req.params.id, { include: User });
        res.send(message);
    } catch {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const create = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json();
    }

    if (req.body.body.trim().length === 0) {
        res.status(422).json();
    }

    try {
        const message = await Message.create({ body: req.body.body, user_id: req.user.id}, { include: User });
        res.send(message);
    } catch {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    index,
    show,
    create,
}