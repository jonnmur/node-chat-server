import 'dotenv/config';
import './config/passport-config.js';
import express from 'express';
import session from 'express-session';
import { router } from './routes/api.js';
import passport from 'passport';
import { redisClient } from './config/redis-config.js';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Server
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true, 
  origin: process.env.ALLOWED_CLIENTS.split(','),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

const server = createServer(app);
//

// Session
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
//

// Socket io
const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_CLIENTS.split(','),
      credentials: true,
    },
});

io.on('connection', async (socket) => {
    console.log(socket.handshake.auth.email + ' connected');

    // Sync connected users list
    const sockets = await io.fetchSockets();
    const users = [];
    sockets.forEach(socket => {
      users.push(socket.handshake.auth);
    });

    io.emit('syncConnectedUsers', users);

    // Send user joined notification to others
    socket.broadcast.emit('userConnected', socket.handshake.auth);

    // Send user disconnected notification to others
    socket.on('disconnect', () => {
      console.log(socket.handshake.auth.email + ' disconnected');

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
app.use('/api', router);
//

server.listen(3000);
