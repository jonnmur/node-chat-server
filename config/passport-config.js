const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authenticateUser = async (username, password, done) => {
    const user = await User.scope('withPassword').findOne({ where: { username: username } });
    
    if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    } catch (error) {
        return done(error);
    }
}

const strategy  = new LocalStrategy(authenticateUser);

passport.use(strategy);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findByPk(userId)
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});