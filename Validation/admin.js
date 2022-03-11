const {body} = require('express-validator');

exports.AdminSignUpValidation = () => {
    return [
        body('name').isString().isLength({ min: 2 }).withMessage('please enter valid name.'),
        body('mail').isEmail().withMessage('please enter valid email'),
        body('password').isString().isLength({min:6}).withMessage('password length is too short.')
     ]    
  
}

exports.AdminLoginValidation = () => {
     return [
        body('mail').isEmail().withMessage('please enter valid email'),
        body('password').isString().isLength({min:6}).withMessage('password length is too short.')
     ]
};
