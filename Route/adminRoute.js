const route = require('express').Router();
const AdminController = require('../Controller/admin');

const {AdminSignUpValidation,AdminLoginValidation} = require('../Validation/admin');

route.post('/signup', AdminSignUpValidation(), AdminController.AdminSignUp);

route.post('/login', AdminLoginValidation(), AdminController.AdminLogin);

module.exports = route;