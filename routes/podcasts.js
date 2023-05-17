const express = require("express");
const router = express.Router();
const { Podcast, validatePodcast } = require("../models/podcast");
const upload = require("../middleware/podcast_upload");

// const { uploadToCloudinary } = require("../cloud/cloudinary");

router.get("/", async (req, res) => {
  const podcast = await Podcast.find().sort("-createdAt");
  res.send(podcast);
});

router.post("/", upload, async (req, res) => {
  try {

    if (!req.body && !req.file) return res.status(400).send("No input set");
  
    const { error, value } = validatePodcast(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // console.log(req.file.path);
  
    // try {
    //   const data = await uploadToCloudinary(req.file.path, "Imedia_podcast")
    //   console.log(data);
    // } catch (err) {
    //   console.log(err);
    // }
  
    // console.log(req.file);
    // console.log(req.body);
  
    const newPodcast = new Podcast({
      title: value.title,
      excerpt: value.excerpt,
      podcast: req.file.filename,
      // podcast: {
      //   data: fs.readFileSync("public/podcasts/" + req.file.filename),
      //   contentType: req.file.mimetype
      // }
    });
  
    // fs.unlinkSync("public/podcasts/" + req.file.filename);
  
    await newPodcast.save()
      // .then((res) => {
      //   console.log(res);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
  
    res.send(newPodcast);
  } catch(ex) {
    console.log(ex);
    res.status(400).send(ex, "An error occured")
  }
});

module.exports = router;
