const express = require("express");
const router = express.Router();
const { Program, validateProgram } = require("../models/program");
// const fs = require("fs");
const upload = require("../middleware/program_upload");
const { uploadToCloudinary } = require("../cloud/cloudinary");

router.get("/", async (req, res) => {
  const programs = await Program.find();
  res.send(programs);
});

router.post("/", upload, async (req, res) => {
  try {
    if (!req.body && !req.files) return res.status(400).send("No input set");

    const { error, value } = validateProgram(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const data = await uploadToCloudinary(
      req.file.path,
      "Imedia_program-images"
    );

    // fs.unlinkSync(req.file.path);

    if (!data && data === undefined) {
      return res.status(404).send("An error occured");
    } else {
      const newProgram = new Program({
        program: value.program,
        desc: value.desc,
        picOne: {
          imageUrl: data.url,
          public_id: data.public_id,
          contentType: req.files.mimetype,
        },
      });

      await newProgram.save();
      res.send(newProgram);
    }
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
