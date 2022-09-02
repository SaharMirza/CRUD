const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const User = require('../Models/User')

module.exports = {
    signAccessToken: (userId) =>{
        return new Promise((resolve,reject)=>{
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn :'1hr',
                issuer: 'pickurpage.com',
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err,token)=> {
                if(err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
     
    },
    verifyAccessToken: (req, res, next) => {
      if (!req.headers['authorization']) return next(createError.Unauthorized())
      const authHeader = req.headers['authorization']
      const bearerToken = authHeader.split(' ')
      const token = bearerToken[1]
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return next(createError.Unauthorized(message))
        }
        req.payload = payload//to attach payload to our request
        next()
      })
    },
    signRrefeshToken: (userId) =>{
        return new Promise((resolve,reject)=>{
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn :'1y',
                issuer: 'pickurpage.com',
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err,token)=> {
                if(err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve,reject)=> {
            JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud

                resolve(userId)
            })   
        })
    },
    checkRole: (req,res,next) => {
        User.findById(req.payload.aud)
        .then(result=>{
            //console.log(result.role)
            if(result.role!=='ADMIN') {
                res.status(401)
                    return res.send('UnAuthorized')
            }
           next()
        })
        
        
    }


}