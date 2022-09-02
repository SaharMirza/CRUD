const Joi = require('@hapi/joi')

const authSchema =Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    username:Joi.string(),
    phoneNumber:Joi.string(),
    address:Joi.string(),
    role:Joi.string(),
    R_ID: Joi.number()
})

module.exports ={
    authSchema
}