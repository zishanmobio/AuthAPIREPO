const route = require('express').Router();
const UserController = require('../Controller/user');
const Middleware = require('../Middleware/auth');
const {body,check } = require('express-validator');
const {SignUpValidation,LoginValidation,UpdateValidation}=require('../Validation/user')
route.post('/register',SignUpValidation(),UserController.UserSignUp);

route.post('/login',LoginValidation(),UserController.UserLogin);

route.get('/profile',Middleware,UserController.UserProfile);

route.put('/update', Middleware,UpdateValidation(),UserController.UpdateProfile);

route.delete('/delete/:id', Middleware, UserController.DeleteProfile);


module.exports = route;