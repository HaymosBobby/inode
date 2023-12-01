const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicUrl: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [
        {
          blogId: {
            type: Types.ObjectId,
            ref: "Blog",
          },
        },
      ],
      default: [],
    },
    podcasts: {
      type: [
        {
          podcastId: {
            type: Types.ObjectId,
            ref: "Blog",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

const User = model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    profilePicUrl: Joi.string(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.ref("password"),
  }).with("password", "confirm_password");

  return schema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;
