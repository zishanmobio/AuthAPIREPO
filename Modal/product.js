const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema({
    email: {
        type: String,
        required:true 
    },
    title: {
        type: String,
        required: true
    },
    prodUrl: {
        type: String
    },
    price: {
        type: Number,
        required:true
    },
    description: {
        type: String
    }
}, { timestamps: true })

module.exports = Mongoose.model('product', ProductSchema);



