const express = require("express");
const router = express.Router();
const { Blog, validateBlog } = require("../models/blog");
// const fs = require("fs");
const upload = require("../middleware/blog_upload");
const { uploadToCloudinary } = require("../cloud/cloudinary");

router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort("-createdAt");
  res.send(blogs);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog)
    res.status(404).send("The blog with the given id is not available");

  res.send(blog);
});

router.post("/", upload, async (req, res) => {
  try {
    if (!req.body && !req.files) return res.status(400).send("No input set");

    const { error, value } = validateBlog(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const imagePaths = [req.files.image1[0].path, req.files.image2[0].path];
    let photos = [];
    for (let imagePath of imagePaths) {
      const data = await uploadToCloudinary(imagePath, "Imedia_images");
      photos.push(data);

      // fs.unlinkSync(imagePath);
    }

    if (photos.length === 0 && photos.includes(undefined)) {
      return res.status(404).send("An error occured");
    } else {
      const newBlog = new Blog({
        title: value.title,
        excerpt: value.excerpt,
        message: value.message,
        picOne: {
          imageUrl: photos[0].url,
          public_id: photos[0].public_id,
          contentType: req.files.image1[0].mimetype,
        },
        picTwo: {
          imageUrl: photos[1].url,
          public_id: photos[1].public_id,
          contentType: req.files.image2[0].mimetype,
        },
      });

      await newBlog.save();
      res.send(newBlog);
    }
  } catch (ex) {
    console.log(ex);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // const genre = validateInput(id);

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) return res.status(400).send("The blog specified is not avilable");

  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);

  res.send(blog);
});

module.exports = router;
