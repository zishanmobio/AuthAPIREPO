// Role Management
const UserSchema = require('../Modal/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
exports.AdminSignUp = async (req,res) => {
    
    try{
        
        let validate = validationResult(req);
         if(!validate.isEmpty()) {
             return res.status(400).json(validate.array());    
         }
 
           let hashpass = bcrypt.hashSync(req.body.password,8);
            
            let admin = new UserSchema({
                email: req.body.mail,
                name: req.body.name,
                password: hashpass,
                role:'admin',
             }) 
             
            await admin.save();      
           
            res.status(200).json({ msg: 'admin signup successfully...' }); 
            
      }catch (err) {
        console.log(err);
         if(err.code===11000 ) {
            return res.status(400).json({msg:'This email is already exists please try with some other one.'})    
         } 
        res.status(500).json({ error: err.message }); 
     } 
}


exports.AdminLogin = async (req,res) => {
     
    try{
  
       let validate = validationResult(req);
         if(!validate.isEmpty()) {
             return res.status(400).json(validate.array());    
         }          
         
       
      let admin = await UserSchema.findOne({ email: req.body.mail, role: 'admin' });
                
        if (!admin)
            return res.status(400).json({msg:'no admin account exists.'});
             
        let isPassCorrect = bcrypt.compareSync(req.body.password,admin.password);  
        if (isPassCorrect) {
            
            let token = jwt.sign({ email:admin.email },process.env.ACCESS_KEY, { expiresIn: '12h', algorithm: 'HS256' }); 
            
            res.status(200).json(token);
        } else
            res.status(400).json({ msg: 'please enter correct password.' });  
        
     
    
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message }); 
    }   

       

}







