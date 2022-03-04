const route = require('express').Router();
const UserController = require('../Controller/user');

route.post('/register', UserController.UserSignUp);

route.post('/login', UserController.UserLogin);

route.get('/profile', UserController.UserProfile);

module.exports = route;