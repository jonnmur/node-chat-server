const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { Op } = require("sequelize");

const localStrategy  = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await User.scope('withPassword').findOne({ where: { email: email } });
    
    if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
    }

    try {
        if (user.password && await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    } catch (error) {
        return done(error);
    }
});

passport.use(localStrategy);

const googleStrategy = new GoogleStrategy(
    {
        clientID: '490077617707-oc04grns3r8kg92eiuum4sggjp4739rj.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
        // User with google_id found, login
        let user = await User.findOne({ where: { [Op.or]: [{ google_id: profile.id }, { email: profile.emails[0].value }] }});

        // User found but does not have google linked
        if (user && !user.google_id) {
            user.google_id = profile.id;
            await user.save();
        }

        // User with google_id or email not found, create new user
        if (!user) {
            user = await User.create({ google_id: profile.id, email: profile.emails[0].value, display_name: profile.displayName });
        }

        return cb(null, user);
    }
);

passport.use(googleStrategy);

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
