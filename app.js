require('dotenv').config();
require('./config/passport-config');
const express = require('express');
const session = require('express-session');
const routes = require('./routes/api');
const passport = require('passport');
const redisClient = require('./config/redis-config');
const connectRedis = require('connect-redis');
const cors = require('cors');
const { createServer  } = require('http');
const { Server } = require('socket.io');

// Server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true, 
  origin: process.env.ALLOWED_CLIENTS.split(',')
}));

const server = createServer(app);
//

// Session
const RedisStore = connectRedis(session);
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
//

// Socket io
const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_CLIENTS.split(','),
      credentials: true,
    },
});

io.on('connection', async (socket) => {
    console.log(socket.handshake.auth.username + ' connected');

    // TODO: first emit all online users, then just emit for every new connected user
    const sockets = await io.fetchSockets();

    sockets.forEach(socket => {
      io.emit('userConnected', socket.handshake.auth);
    });

    socket.on('disconnect', () => {
      console.log(socket.handshake.auth.username + ' disconnected');

      io.emit('userDisconnected', socket.handshake.auth);
    });
});

app.set('io', io);
//

// Passport
app.use(passport.initialize());
app.use(passport.session());
//

// Routes
app.use('/api', routes);
//

server.listen(3000);

module.exports = app;
