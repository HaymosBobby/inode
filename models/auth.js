const Joi = require("joi");

const validateLoginDetails = (loginDetails) => {
  const loginDetailsSchema = Joi.object({
    log: Joi.string().required().min(3).max(499),
    password: Joi.string().required().min(3).max(499),
  });
  return loginDetailsSchema.validate(loginDetails);
};

module.exports = validateLoginDetails;
