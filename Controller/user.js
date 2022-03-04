const bcrypt = require('bcrypt');
const {SignUpValidation,LoginValidation} = require('../Validation/user');
const UserSchema = require('../Modal/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User SignUp  
// Post Request ==> /api/user/register/
exports.UserSignUp = async (req, res) => {
      
    try {
        console.log(req.body);
         let Validate = SignUpValidation(req.body);      
           if (Validate.error) {
              console.log(Validate.error);   
              return res.status(200).json({
                 msg:Validate.error.details[0].message 
              }) 
           }    
          if(!req.file)
              return res.status(400).json('error occured in file upload'); 
          
          let hashpass = bcrypt.hashSync(req.body.password,8); 
          let filepath=`upload/${req.file.filename}`  
             
            let userprofile = new UserSchema({
                email: req.body.mail,
                name: req.body.name,
                password: hashpass,
                ImageUrl: filepath,
                DOB:new Date(req.body.dob)
            })  
              
          await userprofile.save();
          res.status(200).json('user register sucessfully...');  
      
      } catch (err) {
          console.log(err);
         if(err.code === 11000) 
           return res.status(400).json({msg:'Email Already Exists please login !!!'}) 
           
          res.status(400).json('something error with server !!!') 
       }
        
}

// User Login
// Post Request ==> /api/user/login/
exports.UserLogin =async (req,res) => {
     

    try {
        
        let Validate = LoginValidation(req.body);
        console.log(req.body); 
        if (Validate.error) {
            console.log(Validate.error);  
            return res.status(400).json('please enter valid input');  
        }
        let userprofile = await UserSchema.findOne({ email: req.body.mail });  
          
        if(!userprofile)
          return res.status(400).json('no user profile found')      
         
        let isCorrect =bcrypt.compareSync(req.body.password, userprofile.password);  
            
        if (isCorrect) {
              
            let token = jwt.sign({ email: userprofile.email },process.env.ACCESS_KEY, { expiresIn: '1h', algorithm: 'HS256' }); 
            
            res.set('token', token);   
            res.status(200).json(token);
            
        }else
          res.status(200).json('please enter correct password');   


       }catch(err){
        console.log(err);
        res.status(400).json('server error');
       }
     
}

// View UserProfile
// Get Request ==> /api/user/profile

exports.UserProfile = async (req, res) => {
        
    try{
        let token = req.headers.authorization;
        let email = jwt.verify(token,process.env.ACCESS_KEY);   
        
        let userprofile = await UserSchema.findOne({ email: email.email });       
           
        
        res.status(200).json({
            msg: 'user profile',
            profile:userprofile
        })

    } catch (err) {
        console.log(err);
        res.status(400).json('server error'); 
     }  
    
 }


// let dob = new Date('1995-02-03');
// console.log(dob)
// let dobDays = dob.getDate();
// let dobMonth = dob.getMonth();
// let dobYear = dob.getFullYear();

// let curr = new Date();

// let currDays = curr.getDate();
// let currMonth = curr.getMonth();
// let currYear = curr.getFullYear();

// console.log(dobDays, " ", dobMonth, " ", dobYear);
// console.log(currDays, " ", currMonth, " ", currYear);





