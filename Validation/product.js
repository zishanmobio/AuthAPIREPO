const { body,check } = require('express-validator');

exports.ProductValidation = () => {
      
    return [
         body('title').isString().isLength({min:2}).withMessage('please enter valid title'),
         body('price').isNumeric().withMessage('please enter valid price'),
        ]  
};
