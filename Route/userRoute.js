const route = require('express').Router();
const UserController = require('../Controller/user');
const Middleware = require('../Middleware/auth');
const {body,check } = require('express-validator');

route.post('/register', [
    body('mail').isEmail().withMessage('please enter valid email'),
    body('name').isString().isLength({ min: 2 }).withMessage('please enter valid name'),
    body('password').isString().isLength({ min: 6 }).withMessage('password length too short'),
    check('dob').trim().isDate().withMessage('please enter valid DOB')
],UserController.UserSignUp);

route.post('/login', [
    body('mail').isEmail().withMessage('please enter valid email'),
    body('password').isString().isLength({min:6}).withMessage('password length too short ') 
], UserController.UserLogin);

route.get('/profile',Middleware,UserController.UserProfile);

route.put('/updateProfile', Middleware, [
    body('name').isLength({min:2}).withMessage('please enter valid name'),
    body('dob').isDate().withMessage('please enter valid DOB')
],UserController.UpdateProfile);

route.delete('/deleteProfile/:id', Middleware, UserController.DeleteProfile);


module.exports = route;