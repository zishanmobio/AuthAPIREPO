require('dotenv').config();
const bcrypt = require('bcrypt');
// const { SignUpValidation, LoginValidation } = require('../Validation/user');
const UserSchema = require('../Modal/user');
const jwt = require('jsonwebtoken');

const {validationResult} = require('express-validator');


// User SignUp  
// Post Request ==> /api/user/register/
exports.UserSignUp = async (req, res) => {
      
    try {
         console.log(req.body);
         let Validate = validationResult(req);      
                    
        if (!Validate.isEmpty()) {
            console.log(Validate.array());    
            return res.status(200).json(Validate.array()[0].msg);
        }
          
        //   if (!req.file)
        //       return res.status(400).json('error occured in file upload'); 
          
          let hashpass = bcrypt.hashSync(req.body.password,8); 
         
            let userprofile = new UserSchema({
                email: req.body.mail,
                name: req.body.name,
                password: hashpass,
                DOB:new Date(req.body.dob)
            })  
              
          await userprofile.save();
          res.status(200).json('user register sucessfully...');  
      
      } catch (err) {
          console.log(err);
         if(err.code === 11000) 
           return res.status(400).json({msg:'Email Already Exists please login !!!'}) 
           
          res.status(500).json('something error with server !!!') 
       }
        
}

// User Login
// Post Request ==> /api/user/login/
exports.UserLogin =async (req,res) => {
     
    try {
        let Validate = validationResult(req);
        // console.log(req.body); 
        if (!Validate.isEmpty()) {
            // console.log(Validate.error);  
            return res.status(400).json(Validate.array()[0].msg);  
        }
        let userprofile = await UserSchema.findOne({ email: req.body.mail });  
          
        if(!userprofile)
          return res.status(400).json('no user profile found')      
         
        let isCorrect =bcrypt.compareSync(req.body.password, userprofile.password);  
            
        if (isCorrect) {
              
            let token = jwt.sign({ email: userprofile.email },process.env.ACCESS_KEY, { expiresIn: '1h', algorithm: 'HS256' }); 
            
            res.status(200).json(token);
            
        }else
          res.status(200).json('please enter correct password');   


       } catch(err){
        console.log(err);
        res.status(500).json('server error');
       }
     
}

// View UserProfile
// Get Request ==> /api/user/viewProfile

exports.UserProfile = async (req, res) => {
        
    try{
        let headers = req.email; 
         
        let userprofile = await UserSchema.findOne({ email:headers});       
           
        res.status(200).json({
            msg: 'user profile',
            profile:userprofile
        })

    } catch (err) {
        console.log(err);
        res.status(500).json('server error'); 
     }  
    
 }

// update profile name
// PUT Request==> /api/user/updateProfile
exports.UpdateProfile =async(req, res) => {
      
    try{
           
        let Validate = validationResult(req);  
        
        if(!Validate.isEmpty()){ 
            
            return res.status(400).json(Validate.array()[0].msg); 
         }   
         
        let updateUser = await UserSchema.updateOne({ email: { $eq: req.email } },{$set:{ name: req.body.name, DOB: req.body.dob } });
        console.log("user updated",updateUser.modifiedCount);  
          
        res.status(200).json('user profile updated successfully...'); 

      } catch (err) {

        res.status(500).json({ error: err.message});   
     }

}


// delete profile name
// Delete Request ==> /api/user/deleteProfile/:id
exports.DeleteProfile =async (req,res) => {
    
    try {
        let id = req.params.id;  
        
        let userDeleted = await UserSchema.deleteOne({ $and: [{ email: { $eq: req.email } }, { _id: id }] });  
        console.log(userDeleted.deletedCount);   
         
        res.status(200).json('user deleted successfully...'); 

    } catch (err) {
        res.status(500).json({ error: err.message });  
     }
 
}

