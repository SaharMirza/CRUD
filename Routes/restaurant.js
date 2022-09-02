const express = require('express');
const router = express.Router();
const Restaurant = require("../Models/restaurant");
const mongoose = require('mongoose');

//create restuarant
router.post("/", (req, res, next) => {

  const restaurant = new Restaurant({
    _id: new mongoose.Types.ObjectId,
    R_ID: req.body.R_ID,
    R_name: req.body.R_name,
    R_loc: req.body.R_loc,
    R_About: req.body.R_About,
    R_History: req.body.R_History,
    R_logo: req.body.R_logo,
    R_BannerImage: req.body.R_BannerImage,
    R_BannerHeadline: req.body.R_BannerHeadline,
    R_BannerDes: req.body.R_BannerDes,
    R_Cuisine: req.body.R_Cuisine
  })
  restaurant.save() // saving data to database
    .then(result => {
      console.log(result);
      res.status(200).json({
        newRestaurant: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err

      })
    })
})

//get all restuarants
router.get('/', (req, res, next) => {
  Restaurant.find()
    .select("R_ID R_name R_loc R_logo User_ID R_History R_About R_BannerImage R_BannerHeadline R_BannerDes R_Cuisine")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            R_ID: doc.R_ID,
            R_name: doc.R_name,
            R_loc: doc.R_loc,
            R_logo: doc.R_logo,
            R_History: doc.R_History,
            R_About: doc.R_About,
            R_BannerImage: doc.R_BannerImage,
            R_BannerHeadline: doc.R_BannerHeadline,
            R_BannerDes: doc.R_BannerDes,
            R_Cuisine: doc.R_Cuisine,
            request: {
              type: "GET",
              url: "http://localhost:3000/restaurant"
            }
          };
        })
      };
     
      res.status(200).json(response);
     
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;