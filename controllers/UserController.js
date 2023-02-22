const User = require('../models/User');

const index = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    try {
        const users = await User.findAll();
        return res.send(users);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const show = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    try {
        const user = await User.findByPk(req.params.id);
        return res.send(user);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    index,
    show,
}