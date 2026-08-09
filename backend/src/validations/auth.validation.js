import Joi from 'joi';

const schemas = {
  login: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(72).required(),
  }),
  register: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    phone: Joi.string().trim().pattern(/^01[3-9]\d{8}$/).required().messages({ 'string.pattern.base': 'Phone number must be a valid Bangladeshi number' }),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(72).required(),
    accountType: Joi.string().valid('USER', 'VENUE_OWNER').required(),
  }),
};

/** @param {keyof typeof schemas} name @returns {import('express').RequestHandler} */
export function validateAuth(name) {
  return (req, res, next) => {
    const { value, error } = schemas[name].validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) { res.status(400).json({ error: error.details.map((item) => item.message).join(', ') }); return; }
    req.body = value;
    next();
  };
}
