import Joi from "joi"


export const userValidation = Joi.object({
    username: Joi.string().min(3).max(30).allow(""),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


export const userValidationForLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})