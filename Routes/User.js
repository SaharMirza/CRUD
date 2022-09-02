const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User = require('../Models/User')
const { authSchema } = require('../helpers/validationschema')
const { checkRole,signAccessToken, signRrefeshToken, verifyRefreshToken, verifyAccessToken } = require('../helpers/jwthelper')
const bcrypt = require('bcrypt');

//Create User
router.post('/register', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)

        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createError.Conflict(`${result.email} is already been registered`)

        const user = new User({
            username:result.username,
            password:result.password,
            phoneNumber:result.phoneNumber,
            email:result.email,
            address:result.address,
            role:result.role,
            status:"ACTIVE",
            R_ID: result.R_ID
        })
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRrefeshToken(savedUser.id)
        res.send({ accessToken, refreshToken })


    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })

        if (!user) throw createError.NotFound('User not registered')
        if (user.status == "InActive") throw createError.NotFound('User has been Deleted')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRrefeshToken(user.id)
        res.send({ accessToken, refreshToken })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }
})

//Read individual user
router.get('/:id', async (req, res, next) => {
    User.findById({ _id: req.params.id })
    .then(result => {
        res.status(200).json({
            user: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })

    })
})

//Read all users
//users can only be read by admins 
router.get('/', verifyAccessToken,checkRole,async (req, res, next) => {
    //req.payload.aud gives us the id of the loged in user 
    User.findById(req.payload.aud)
        .then(result => {
            //Getting User of only Resturantof the logged in
            User.find({ R_ID: result.R_ID })
                .exec()
                .then(result => {
                    res.status(200).json({
                        Users: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
})

//Update User
router.put('/:id',verifyAccessToken,async(req,res,next)=>{
    // validate data type of every attribute in  user table
    const result = await authSchema.validateAsync(req.body) 
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    username: result.username,
                    password: hash,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    address: result.address
                }
            })
                .then(result => {
                    res.status(200).json({
                        updated_User: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })
})

//delete User
router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json({
                updated_user: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRrefeshToken(userId)
        res.send({ accessToken: accessToken, refreshToken: refToken })

    } catch (error) {
        next(error)

    }
})

module.exports = router