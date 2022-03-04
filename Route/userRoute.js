const route = require('express').Router();
const UserController = require('../Controller/user');
const Middleware = require('../Middleware/auth');

route.post('/register', UserController.UserSignUp);

route.post('/login', UserController.UserLogin);

route.get('/profile',Middleware,UserController.UserProfile);

module.exports = route;