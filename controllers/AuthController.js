const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(4).max(40).required(),
    password: Joi.string().min(8).max(40).required(),
});

const register = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });

        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(422).json(error.details);
        }

        if (user) {
            return res.status(422).json([{ message: 'Username not available' }]);
        }

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }

    try {
        const password = await bcrypt.hash(req.body.password, 10);
        await User.create({ username: req.body.username.trim(), password: password });
        return res.status(201).json({ message: 'User created' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const login = (req, res, next) => {
    const handler = passport.authenticate('local', (error, user, info) => {
        if (error) {
            return next(error);
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

    req.logout((error) => {
        if (error) { 
            return next(error); 
        }
        return res.status(200).json();
  });
}

module.exports = {
    register,
    login,
    logout,
}