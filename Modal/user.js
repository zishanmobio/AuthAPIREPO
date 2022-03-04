const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true, 
    },
    ImageUrl:String,
    DOB:{
      type:Date  
    }
}, { timestamps: true })

UserSchema.index({ email: 1 },{unique:true});

module.exports = Mongoose.model('profile', UserSchema);

