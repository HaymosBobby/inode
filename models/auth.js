const Joi = require("joi");

const validateLoginDetails = (loginDetails) => {
  const loginDetailsSchema = Joi.object({
    email: Joi.string().required().min(3).max(499).email(),
    password: Joi.string().required().min(8).max(499)
  });
  return loginDetailsSchema.validate(loginDetails);
};

module.exports = validateLoginDetails;