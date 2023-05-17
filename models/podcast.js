const mongoose = require("mongoose");
const Joi = require("joi");

const Podcast = mongoose.model("Podcast", new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 499,
    required: true
  },
  excerpt: {
    type: String,
    minlength: 3,
    maxlength: 499,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  },
  podcast: {
    type: String,
    required: true,
  },
}));


const validatePodcast = (podcast) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    excerpt: Joi.string().min(10).max(100).required()
  });

  return schema.validate(podcast);
};

exports.Podcast = Podcast;
exports.validatePodcast = validatePodcast;