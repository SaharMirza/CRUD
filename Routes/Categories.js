const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const mongoose = require('mongoose');
const {verifyAccessToken } = require('../helpers/jwthelper')
const User = require('../Models/User')

// add new Category 
router.post('/', verifyAccessToken, (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId,
        Cat_Name: req.body.Cat_Name,
        Parent_id: req.body.Parent_id,
        R_ID: req.body.R_ID
    })

    category.save() // saving data to database
        .then(result => {
            console.log(result);
            res.status(200).json({
                newCategory: result
            })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            })
        })
})

// Read Category 
router.get('/', verifyAccessToken, (req, res, next) => {
    User.findById(req.payload.aud)
        .then(result => {
            Category.find({ R_ID: result.R_ID })
                .exec()
                .then(result => {
                    res.status(200).json({
                        categoryData: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
});

// can get Category by their category id 
router.get('/:id', verifyAccessToken, (req, res, next) => {
    console.log(req.params.id);
    Category.findById(req.params.id)
        .then(result => {
            res.status(200).json({
                categoryData: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

//update Category data
router.put('/:id', verifyAccessToken, (req, res, next) => {
    console.log(req.body)
    Category.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            Cat_Name: req.body.Cat_Name,
            Parent_id: req.body.Parent_id
        }
    })
        .then(result => {
            res.status(200).json({
                updated_Category: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})

//delete category request
router.delete('/:id', verifyAccessToken ,(req, res, next) => {
    Category.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: 'Category deleted',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;