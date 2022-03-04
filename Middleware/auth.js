const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
    try {
        let token = req.headers.authorization;
        let email = jwt.verify(token,process.env.ACCESS_KEY);
        req.email = email;    
        next();  
    }catch (err) {
        console.log(err);
        res.status(400).json('Invalid token');        
    }
     
}


