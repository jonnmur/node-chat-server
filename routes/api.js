import Router from 'express';

import * as AuthController from '../controllers/AuthController.js'
import * as UserController from '../controllers/UserController.js'
import * as MessageController from '../controllers/MessageController.js'

export const router = new Router();

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
