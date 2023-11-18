const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const MessageController = require('../controllers/MessageController');

// Auth
router.get('/auth/me', AuthController.me);
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/google', AuthController.googleAuth);
router.get('/auth/google/callback', AuthController.googleAuthCallback);

// User
router.get('/user', UserController.index);
router.get('/user/:id', UserController.show);

// Message
router.get('/message/', MessageController.index);
router.get('/message/:id', MessageController.show);
router.post('/message/', MessageController.create);

module.exports = router;
