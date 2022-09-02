const mongoose = require("mongoose");
const Schema = mongoose.Schema 


const restaurantSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,    
    R_ID: {type: Number, unique: true},
    R_name: {type: String},
    R_loc : {type: String},
    R_About :{type: String},
    R_History:{type: String},
    R_logo: {type: String},
    R_BannerImage: {type: String},
    R_BannerHeadline:{type: String},
    R_Cuisine:{type:String},
    R_BannerDes: {type: String}

})

const restaurant = mongoose.model('restaurant',restaurantSchema)
module.exports = restaurant