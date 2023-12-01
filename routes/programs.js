const router = require("express").Router();
const { Program, validateProgram } = require("../models/program");
const admin = require("../middleware/admin");
const upload = require("../middleware/program_upload");
const uploadFile = require("../firebase/firebase");
const { Types } = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const programs = await Program.find();
    if (programs && programs.length <= 0)
      return res.status(404).send({ mesage: "No programs found!." });

    res.status(200).send({ data: programs, message: "Success!" });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const program = await Program.findById(id);
    if (!program) return res.status(404).send("Program not found!.");

    res.status(200).send({ data: program, message: "Success!" });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
  }
});

router.post("/", upload, admin, async (req, res) => {
  try {
    // Check for existence of input data
    if (!req.body || !req.file) return res.status(400).send("No input set");

    // Validate input data
    const { error, value } = validateProgram(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check for existence of Program
    const program = await Program.findOne({ program: value.program });

    if (program)
      return res.status(200).send({ message: "Program already exists" });

    // Upload files to storage
    const file = req.file;
    const url = await uploadFile(file, "programImages");

    // Create new program
    const newProgram = new Program({
      program: value.program,
      desc: value.desc,
      anchor: value.anchor,
      picURL: url,
      userId: new Types.ObjectId(value.userId),
    });

    // Save to database
    const savedProgram = await newProgram.save();
    res.status(200).send({
      program: savedProgram,
      message: "Program created successfully!",
    });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error);
  }
});

router.put("/:id", admin, async (req, res) => {
  const id = req.params.id;

  try {
    // Check for existence of program
    const program = await Program.findById(id);
    if (!program) return res.status(404).send("Program not found!.");

    // Check for existence of input data
    if (!req.body) return res.status(400).send("No input set");

    // Validate input data
    const { error, value } = validateProgram(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create updated program
    const updatedProgram = {
      program: value.program,
      desc: value.desc,
      picUrl: value.picUrl,
    };

    const savedProgram = await Program.updateOne(
      { _id: id },
      { $set: updatedProgram }
    );

    res.status(200).send({ data: savedProgram, messae });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error);
  }
});

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;

  try {
    const program = await Program.findById(id);

    if (!program) return res.status(404).send("Program not found");

    const deletedProgram = await Program.findByIdAndDelete(id);

    res.status(200).send({
      data: deletedProgram,
      message: "Program deleted successfully!.",
    });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
  }
});

module.exports = router;
