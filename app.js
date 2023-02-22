require('dotenv').config();
require('./config/passport-config');
const express = require('express');
const session = require('express-session');
const routes = require('./routes/api');
const passport = require('passport');

const app = express();
const port = 3000;

app.listen(port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
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