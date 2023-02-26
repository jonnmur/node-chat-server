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

const server = require('http').createServer(app);

// socket io
const io = require('socket.io')(server, {
    cors: {
      origins: ['http://localhost:8080']
    }
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

app.set('io', io);
//

server.listen(port);

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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', routes);

module.exports = app;