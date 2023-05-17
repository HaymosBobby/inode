const mongoose = require("mongoose");
const Joi = require("joi");

const Program = mongoose.model("Program", new mongoose.Schema({
  program: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
  },
  desc: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
  },
  pic: {
    imageUrl: String,
    public_id: String,
    contentType: String,
    // required: true
  },
}));

const validateProgram = (program) => {
  const schema = Joi.object({
    program: Joi.string().min(3).max(100).required(),
    desc: Joi.string().min(3).max(100).required(),
  });

  return schema.validate(program);
};

exports.Program = Program;
exports.validateProgram = validateProgram;

