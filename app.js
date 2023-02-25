require('dotenv').config();
require('./config/passport-config');
const express = require('express');
const session = require('express-session');
const routes = require('./routes/api');
const passport = require('passport');
const redisClient = require('./config/redis-config');
const connectRedis = require('connect-redis');

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.listen(port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
const RedisStore = connectRedis(session);

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

// Get routes
app.use('/api', routes);

module.exports = app;