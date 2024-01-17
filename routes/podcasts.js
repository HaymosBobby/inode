const router = require("express").Router();
const { Podcast, validatePodcast } = require("../models/podcast");
const path = require("path");

const admin = require("../middleware/admin");
const { uploadFile, deleteFile } = require("../firebase/firebase");
const { Types } = require("mongoose");
const upload = require("../middleware/podcast_upload");

const folder = "podcasts";

router.get("/", async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate([
        { path: "programId", select: "picURL anchor" },
        { path: "userId", select: "username" },
      ])
      .sort("-createdAt");

    if (podcasts && podcasts.length <= 0)
      return res.status(404).send({ message: "No Podcasts found!." });

    res.status(200).send({ data: podcasts, message: "Success!." });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const podcast = await Podcast.findById(id).populate("programId", "picURL");

    if (!podcast)
      return res.status(404).send({ message: "No Podcast found!." });
    res.status(200).send({ data: podcast, message: "Success!." });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.post("/", upload, admin, async (req, res) => {
  try {
    // Check for the existence of input data
    if (!req.body || !req.file)
      return res.status(400).send({ message: "No input set" });

    // Validate input data
    const { error, value } = validatePodcast(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const { title, excerpt, programId, userId } = value;

    // Upload files to storage
    const file = req.file;

    const url = await uploadFile(file, folder);

    // Create new Podcast
    const newPodcast = new Podcast({
      title,
      excerpt,
      podcastURL: url,
      podcastSize: file.size,
      programId: new Types.ObjectId(programId),
      userId: new Types.ObjectId(userId),
    });

    // Save Podcast to database
    const savedPodcast = await newPodcast.save();

    res
      .status(200)
      .send({ data: savedPodcast, message: "Podcast created successfully!." });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.put("/:id", upload, admin, async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  // console.log(req.file);

  try {
    // Check for existence of podcast
    const podcast = await Podcast.findById(id);
    if (!podcast)
      return res.status(404).send({ message: "Podcast not found!." });

    // Check for existence of  input data.
    if (!req.body) return res.status(400).send({ message: "No input set" });

    // Validate Input
    const { error, value } = validatePodcast(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const { title, excerpt, programId, userId } = value;

    // Check for file
    let updatedPodcast;
    if (req.file) {
      const file = req.file;
      const url = await uploadFile(file, folder);

      // Delete the old podcastURL from store
      const urlObj = new URL(podcast.podcastURL);
      const fileName = decodeURIComponent(path.basename(urlObj.pathname));
      const filePath = `${folder}/${fileName}`;

      await deleteFile(filePath);

      // Create updated podcast
      updatedPodcast = {
        title,
        excerpt,
        podcastURL: url,
        podcastSize: file.size,
        userId: new Types.ObjectId(userId),
        programId: new Types.ObjectId(programId),
      };
    } else {
      updatedPodcast = {
        title,
        excerpt,
        podcastURL: podcast.podcastURL,
        podcastSize: podcast.size,
        userId: new Types.ObjectId(userId),
        programId: new Types.ObjectId(programId),
      };
    }

    // Update in the database
    updatedPodcast = await Podcast.updateOne(
      { _id: id },
      { $set: updatedPodcast }
    );

    res.status(200).send({
      data: updatedPodcast,
      message: "Podcast updated successfully!.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  const { id } = req.params;

  try {
    let podcast = await Podcast.findById(id);

    if (!podcast)
      return res
        .status(404)
        .send({ message: "The podcast specified is not avilable" });

    // Delete the old podcastURL from store
    const urlObj = new URL(podcast.podcastURL);
    const fileName = decodeURIComponent(path.basename(urlObj.pathname));
    const filePath = `${folder}/${fileName}`;

    await deleteFile(filePath);

    // Delete from database
    podcast = await Podcast.findByIdAndDelete(id);

    res
      .status(200)
      .send({ data: podcast, message: "Podcast deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error);
  }
});

module.exports = router;
