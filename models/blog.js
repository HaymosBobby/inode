const { Schema, Types, model } = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Blog = model(
  "Blog",
  new Schema(
    {
      title: {
        type: String,
        minlength: 3,
        maxlength: 499,
        required: true,
      },

      excerpt: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
      },

      message: {
        type: String,
        minlength: 50,
        required: true,
      },

      picOneURL: {
        type: String,
        minlength: 8,
        required: true,
      },

      picTwoURL: {
        type: String,
        minlength: 8,
        required: true,
      },

      categories: {
        type: Array,
        required: true,
        validate: [(v) => v.length >= 1, "At least one category is required!"],
      },

      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  )
);

const validateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    excerpt: Joi.string().min(10).max(100).required(),
    message: Joi.string().min(50).required(),
    // picOneUrl: Joi.string().min(8).required(),
    // picTwoUrl: Joi.string().min(8).required(),
    userId: Joi.objectId().required(),
    categories: Joi.array().items(Joi.string().required()),
  });

  return schema.validate(blog);
};

exports.Blog = Blog;
exports.validateBlog = validateBlog;
