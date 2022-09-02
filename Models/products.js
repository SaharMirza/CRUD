const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ProductsSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Item_Name:{
        type: String,
        required: true,
        unique: true
    },
    Cat_id:{
        type: String,
        required: true
    },
    Item_price:{
        type:Number,
        required:true
    },
    Item_picture:String,
    Item_desc:String,
    R_ID: {
        type: Number,
        required: true
    }

    
})

module.exports = mongoose.model('Products',ProductsSchema);