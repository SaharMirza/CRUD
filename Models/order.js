const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    Order_ID: mongoose.Schema.Types.ObjectId,
    CustomerName: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ["delivered", "cancelled", "prepared", "out for delivery"], 
        required: true
    },
    OrderDate: {
        type: String,
        required: true
    },
    Creation_time: {
        type: String,
        required: true
    },
    Delivered_time: {
        type: String
    },
    isActive: {
        type: Boolean,
        required: true
    },
    Products: {
        type: Object,
        required: true
    },
    OrderTotal: {
        type: Number,
        required: true
    },
    DeliveryAddress: {
        type: String,
        required: true
    },
    SpecialInstructions: {
        type: String
    },
    PaymentMethod:{
        type: String,
        required: true
    }
});


const Order = mongoose.model('order', orderSchema)
module.exports = Order