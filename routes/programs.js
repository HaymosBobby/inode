const router = require("express").Router();
const { Program, validateProgram } = require("../models/program");
const admin = require("../middleware/admin");
const upload = require("../middleware/program_upload");
const { uploadFile, deleteFile } = require("../firebase/firebase");
const { Types, startSession } = require("mongoose");
const path = require("path");
const folder = "programImages";

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
  const { id } = req.params;

  try {
    const program = await Program.findById(id);
    if (!program)
      return res.status(404).send({ message: "Program not found!." });

    res.status(200).send({ data: program, message: "Success!" });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
  }
});

router.post("/", upload, admin, async (req, res) => {
  try {
    // Check for existence of input data
    if (!req.body || !req.file)
      return res.status(400).send({ message: "No input set" });

    // Validate input data
    const { error, value } = validateProgram(req.body);
    if (error) return res.status(400).send({ message: error.message });
    const { programName, description, anchor, userId } = value;

    // Check for existence of Program
    const program = await Program.findOne({ programName });

    if (program)
      return res.status(200).send({ message: "Program already exists" });

    // Upload files to storage
    const file = req.file;
    const url = await uploadFile(file, folder);

    // Create new program
    const newProgram = new Program({
      programName,
      description,
      anchor,
      picURL: url,
      userId: new Types.ObjectId(userId),
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

router.put("/:id", upload, admin, async (req, res) => {
  const { id } = req.params;
  // const session = await startSession();
  // session.startTransaction();

  try {
    // Check for existence of program
    const program = await Program.findById(id);
    if (!program)
      return res.status(404).send({ message: "Program not found!." });

    // Check for existence of input data
    if (!req.body) return res.status(400).send({ message: "No input set" });

    // Validate input data
    const { error, value } = validateProgram(req.body);
    if (error) return res.status(400).send({ message: error.message });
    const { programName, description } = value;

    // Create updated program
    let updatedProgram;
    if (req.file) {
      const file = req.file;
      const url = await uploadFile(file, folder);

      // Delete the old picUrl from store
      const urlObj = new URL(program.picURL);
      const fileName = decodeURIComponent(path.basename(urlObj.pathname));
      const filePath = `${folder}/${fileName}`;

      await deleteFile(filePath);

      // Create updated program.
      updatedProgram = {
        programName,
        description,
        picURL: url,
      };
    } else {
      updatedProgram = {
        programName,
        description,
        picURL: program.picURL,
      };
    }

    const savedProgram = await Program.updateOne(
      { _id: id },
      { $set: updatedProgram }
    );
    // .session(session);

    // await session.commitTransaction();

    res
      .status(200)
      .send({ data: savedProgram, message: "Program updated successfully!" });
  } catch (error) {
    // await session.abortTransaction();
    res.status(500).send({ Error: error, message: error.message });
    console.log(error);
  }
  // finally {
  //   session.endSession();
  // }
});

router.delete("/:id", admin, async (req, res) => {
  const { id } = req.params;

  try {
    const program = await Program.findById(id);

    if (!program) return res.status(404).send("Program not found");

    const urlObj = new URL(program.picURL);
    const fileName = decodeURIComponent(path.basename(urlObj.pathname));
    const filePath = `${folder}/${fileName}`;

    await deleteFile(filePath);

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
