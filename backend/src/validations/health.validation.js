import Joi from 'joi';

export const healthValidation = {
  headers: Joi.object({
    accept: Joi.string().optional(),
  }).unknown(true),
};
