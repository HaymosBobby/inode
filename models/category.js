const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const categorySchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
});

const Category = model("Category", categorySchema);

const validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(category);
};

exports.Category = Category;
exports.validateCategory = validateCategory;
