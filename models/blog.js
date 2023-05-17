const mongoose = require("mongoose");
const Joi = require("joi");

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
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
    createdAt: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    picOne: {
      imageUrl: String,
      public_id: String,
      contentType: String,
      // required: true
    },
    picTwo: {
      imageUrl: String,
      public_id: String,
      contentType: String,
      // required: true
    },
    category: {
      type: Array,
      // minlength: 3,
      // maxlength: 20,
      // required: true,
    },
  })
);

const validateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    excerpt: Joi.string().min(10).max(100).required(),
    message: Joi.string().min(50).required(),
    // category: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(blog);
};

exports.Blog = Blog;
exports.validateBlog = validateBlog;

