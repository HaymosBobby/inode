const Joi = require("joi");
const { model, Schema } = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const Program = model(
  "Program",
  new Schema(
    {
      program: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
      },
      desc: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
      },
      anchor: {
        type: String,
        required: true,
      },
      picURL: {
        type: String,
        minlength: 8,
        required: true,
      },
    },
    { timestamps: true }
  )
);

const validateProgram = (program) => {
  const schema = Joi.object({
    program: Joi.string().min(3).max(100).required(),
    anchor: Joi.string().required(),
    desc: Joi.string().min(3).max(100).required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(program);
};

exports.Program = Program;
exports.validateProgram = validateProgram;
