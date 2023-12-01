const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectid = require("joi-objectid");
Joi.objectId = require("joi-objectid")(Joi);

const Podcast = mongoose.model(
  "Podcast",
  new mongoose.Schema(
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
        maxlength: 499,
        required: true,
      },
      podcastURL: {
        type: String,
        minlength: 8,
        required: true,
      },
      podcastSize: {
        type: Number,
        required: true,
      },
      programId: {
        type: mongoose.Types.ObjectId,
        ref: "Program",
        required: true,
      },
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  )
);

const validatePodcast = (podcast) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    excerpt: Joi.string().min(10).max(100).required(),
    programId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    podcastURL: Joi.string().min(3),
  });

  return schema.validate(podcast);
};

exports.Podcast = Podcast;
exports.validatePodcast = validatePodcast;
