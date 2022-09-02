const express = require('express');
const router = express.Router();
const OrderDetails = require('../models/order');
const mongoose = require('mongoose');

// add new item 
router.post('/', (req, res, next) => {
    const Order = new OrderDetails({
        _id: new mongoose.Types.ObjectId,
        Products: req.body.Products,
        OrderTotal: req.body.OrderTotal,
        CustomerName: req.body.CustomerName,
        Status: req.body.Status,
        OrderDate:req.body.OrderDate,
        Creation_time: req.body.Creation_time,
        Delivered_time: req.body.Delivered_time,
        isActive:true,
        DeliveryAddress:req.body.DeliveryAddress,
        SpecialInstructions: req.body.SpecialInstructions,
        PaymentMethod:req.body.PaymentMethod
    })

    Order.save() // saving data to database
        .then(result => {
            console.log(result);
            res.status(200).json({
                newOrder: result
            })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            })
        })
})


module.exports = router;