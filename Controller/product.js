const ProdSchema = require('../Modal/product');
const {validationResult} = require('express-validator');
const UserSchema = require('../Modal/user');
const {DeleteFile} = require('../UtilityFunction/utilityfun');
// create product
// Post Request ==> /api/product/create

exports.CreateProduct =async(req,res) => {
     
   try{
    
    let validate = validationResult(req);      
     
    if (!validate.isEmpty()) {
        console.log(validate.array());  
        return res.status(400).json(validate.array());
     } 
        
    if(!req.file) 
       return res.status(400).json('no file exits.')   
         
    let user = await UserSchema.findOne({email:req.email});  
      
    if (!user)
        return res.status(400).json('no user exists');
         
      let product = new ProdSchema({
        email:user.email,  
        title: req.body.title,
        description: req.body.description !== undefined ? req.body.description : undefined,
        price: req.body.price,
        prodUrl:`upload/${req.file.filename}`
      })
     
      let created = await product.save();
    //   console.log("product created-->",created); 
      user.product.push(created);  
      await user.save();
     
      res.status(201).json('product added successfully...');   
     
    }catch (err) {
        console.log(err);  
        res.status(500).json({ errro: err.message }); 
    }    
     
}

//Get all product that create by user
//Get Request==> /api/product/all

exports.GetAllProduct=(req,res) => {
    
    
    UserSchema.findOne({ email: req.email }).populate('product')
    .then(user => {
        if(!user)
          return res.status(400).json('no user exists') ;
            
        res.status(200).json({product:user.product});  
         
    }).catch(err => {
        console.log(err);
        res.status(500).json({ errro: err.message });
    })
      
}



// Get product by id
//Get Request ==> /api/product/:id
exports.GetProductByID = (req,res) => {
       
    let id = req.params.id; 
    
        ProdSchema.findOne({$and:[{ _id: id },{email:req.email}]})               
        .then(result => {
            if (!result)
                return res.status(400).json('no product exits');
             
            res.status(200).json(result);    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message }); 
        })  
     
} 



//update product
// Put Request==> /api/product/:id
exports.UpdateProductByID =async (req,res) => {
    
    try{ 
        let id = req.params.id;
        let validate = validationResult(req);   
        if(!validate.isEmpty()) 
          return res.status(400).json(validate.array());          
          
        let user = await UserSchema.findOne({ email: req.email });
         if(!user)
            return res.status(400).json('no user exists');
          
        let update_prod = await ProdSchema.updateOne({_id:id},{$set:{title:req.body.title,price:req.body.price}}); 
         console.log("product updated:",update_prod.modifiedCount);   
         
         res.status(200).json('product updated successfully...');  

     }catch (err) {
        console.log(err); 
        res.status(500).json({ error: err.message }); 
     }   

        
}

// delete product
// Delete Request==> /api/product/:id 
exports.DeleteProductByID = async(req,res)=>{
     
    try {
       let id = req.params.id;    
       let user = await UserSchema.findOne({ email: req.email }).populate('product');
         
        if (!user)
          return res.status(400).json('no user exists');                
        
        await ProdSchema.deleteOne({ $and: [{ _id: id },{ email: req.email }] }); 
        
        let prodlist = user.product.filter((prod) => prod._id != id);
        let isexists = user.product.find((prod) => prod._id == id);
         
        if (isexists) { 
           DeleteFile(prod.prodUrl);
         }
        user.product = prodlist;
        await user.save();

        // console.log("product deleted:", delete_prod.deletedCount);  
         
        res.status(200).json('product deleted successfully...');

    }catch (err) {
       console.log(err); 
       res.status(500).json({ error: err.message }); 
    }

};

