const express = require('express')//to create the http sever 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createError = require('http-errors')
require('dotenv').config()
const UserRoute = require('./Routes/User')
const restaurantRoutes = require('./routes/restaurant');
const fooditemRoute = require('./Routes/Products')
const Orders = require('./Routes/order')
const Categories = require('./Routes/Categories')
const { verifyAccessToken } = require('./helpers/jwthelper')

// connect db to node.js using link from database access and writing password 
mongoose.connect(`mongodb+srv://SaharMirza:${process.env.MDPASSWORD}.mwwmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

// to check if connection established or not 
mongoose.connection.on('error', err => {
    console.log('connection failed'); // if error in connected to db
});

mongoose.connection.on('connected', connected => {
    console.log('connected with db sucessfully....'); // if connected to db
})

//initalize app as express application
const app = express()

//parse request to body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //data recieved should be in JSON


app.use('/user', UserRoute)
app.use('/restaurant', restaurantRoutes);
app.use('/Food_item', fooditemRoute)
app.use('/Order', Orders)
app.use('categories', Categories)

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send("Hello from express.")

})

//catch wrong route 
app.use(async (req, res, next) => {
    next(createError.NotFound())
})

//error handler 
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

//store details in env file
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`)
})