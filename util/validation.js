const Joi = require("@hapi/joi");

const signupSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

module.exports = { signupSchema, loginSchema };
