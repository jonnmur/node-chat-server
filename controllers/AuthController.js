const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

const register = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });

        if (user) {
            return res.status(422).json({ message: 'Invalid username' });
        }

        if (req.body.username.trim().length === 0) {
            return res.status(422).json({ message: 'Invalid username' });
        }

        if (req.body.username.trim().length === 0) {
            return res.status(422).json({ message: 'Invalid username' });
        }

        if (req.body.password.length < 8) {
            return res.status(422).json({ message: 'Invalid password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }

    try {
        const password = await bcrypt.hash(req.body.password, 10);
        await User.create({ username: req.body.username, password: password });
        return res.status(201).json({ message: 'User created' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const login = (req, res, next) => {
    const handler = passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json(info);
        } else {
            req.logIn(user, () => {
                return res.status(200).json();
            })
        }    
    });

    handler(req, res, next);
}

const logout = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    req.logout((err) => {
        if (err) { 
            return next(err); 
        }
        return res.status(200).json();
  });
}

module.exports = {
    register,
    login,
    logout,
}