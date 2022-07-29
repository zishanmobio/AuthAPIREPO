const { body,check } = require('express-validator');

exports.SignUpValidation = () => {
      
    return [
         body('mail').isEmail().isString().withMessage('please enter valid email'),
         body('name').isString().isLength({ min: 2 }).withMessage('please enter valid name'),
         body('password').isString().isLength({ min: 6 }).withMessage('password length too short'),
         check('dob').trim().isDate().withMessage('please enter valid DOB')
       ]  
}

exports.LoginValidation = () => {
      
    return [
        body('mail').isEmail().withMessage('please enter valid email'),
        body('password').isString().isLength({min:6}).withMessage('password length too short ') 
      ]
}


exports.UpdateValidation = () => {
     
    return [
       body('name').isLength({min:2}).withMessage('please enter valid name'),
       body('dob').isDate().withMessage('please enter valid DOB')
      ] 
}

