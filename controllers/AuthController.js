const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().min(4).max(40).required(),
    display_name: Joi.string().min(4).max(40).required(),
    password: Joi.string().min(8).max(40).required(),
});

const me = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json();
    }

    return res.status(200).json(req.user);
}

const register = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(422).json(error.details);
        }

        if (user) {
            return res.status(422).json([{ message: 'Email not available' }]);
        }

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }

    try {
        const password = await bcrypt.hash(req.body.password, 10);
        await User.create({ email: req.body.email.trim(), display_name: req.body.display_name.trim(), password: password });
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

const googleAuth = async (req, res, next) => {
    const handler = passport.authenticate('google', { scope: ['email', 'profile'] });
    
    req.session.client = req.query.client;

    handler(req, res, next);
}

const googleAuthCallback = async (req, res, next) => {
    const handler = passport.authenticate('google', { failureRedirect: req.session.client, successRedirect: req.session.client });

    handler(req, res, next);
}

module.exports = {
    me,
    register,
    login,
    logout,
    googleAuth,
    googleAuthCallback,
}
