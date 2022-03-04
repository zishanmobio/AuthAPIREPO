const JOI = require('joi');
const Joi=require('joi').extend(require('@joi/date'))

exports.SignUpValidation = (data) => {
      
    const Schema =JOI.object({
        name: JOI.string().min(3).message('please enter valid name'),
        mail: JOI.string().min(5).email(),
        password: JOI.string().min(6).required(),
        dob:Joi.date().format('YYYY-MM-DD').utc()
    })
    
    return Schema.validate(data);

}

exports.LoginValidation = (data) => {
      
    const Schema =JOI.object({
        mail: JOI.string().min(5).email(),
        password: JOI.string().min(6).required()
    })
    
    return Schema.validate(data);

}


