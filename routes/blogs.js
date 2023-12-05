const router = require("express").Router();
const { Blog, validateBlog } = require("../models/blog");
const admin = require("../middleware/admin");
const upload = require("../middleware/blog_upload");
const { Types } = require("mongoose");
const { uploadFile, deleteFile } = require("../firebase/firebase");
const path = require("path");

const folder = "postImages";

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("userId", "username")
      .sort("-createdAt");

    if (blogs && blogs.length <= 0)
      return res.status(404).send("No Blogs found!.");

    res.status(200).send({ data: blogs, message: "Success" });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate("userId", "username");
    if (!blog) return res.status(404).send("No Blog found!.");

    res.status(200).send({ data: blog, message: "Success" });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.post("/", upload, admin, async (req, res) => {
  try {
    // Check for existence of input data.
    if (!req.body || !req.files) return res.status(400).send("No input set");

    // Validate Input
    const { error, value } = validateBlog(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { title, excerpt, message, categories, userId } = value;

    // Upload files to storage
    let urls = [];
    if (Object.entries(req.files).length !== 2)
      return res.status(400).send({ message: "Two files required!!" });

    const files = [req.files.image1[0], req.files.image2[0]];

    for (let file of files) {
      const response = await uploadFile(file, folder);
      urls.push(response);
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      excerpt,
      message,
      categories,
      picOneURL: urls[0],
      picTwoURL: urls[1],
      userId: new Types.ObjectId(userId),
    });

    // Save to Database
    const savedBlog = await newBlog.save();
    res
      .status(200)
      .send({ data: savedBlog, message: "Post created successfully!." });
  } catch (error) {
    res.status(500).json({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.put("/:id", upload, admin, async (req, res) => {
  const { id } = req.params;
  try {
    // Check for existence of blog
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send("Blog not found!.");

    // Check for existence of  input data.
    if (!req.body) return res.status(400).send("No input set");

    // Validate Input
    const { error, value } = validateBlog(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { title, excerpt, message, categories, userId } = value;

    // Create updated blog
    let updatedBlog;
    // Check for existence files
    if (req.files && Object.entries(req.files).length === 2) {
      const files = [req.files.image1[0], req.files.image2[0]];
      let urls = [];

      for (let file of files) {
        const response = await uploadFile(file, folder);
        urls.push(response);
      }

      // Delete the old postURLs from store
      const picUrls = [blog.picOneURL, blog.picTwoURL];

      for (let url of picUrls) {
        const urlObj = new URL(url);
        const fileName = decodeURIComponent(path.basename(urlObj.pathname));
        const filePath = `${folder}/${fileName}`;
        await deleteFile(filePath);
      }

      updatedBlog = {
        title,
        excerpt,
        message,
        categories,
        picOne: urls[0],
        picTwo: urls[1],
        userId: new Types.ObjectId(userId),
      };
    } else if (req.files && Object.entries(req.files).length === 1) {
      if (req.files.image1) {
        let file = req.files.image1[0];
        const url = await uploadFile(file, folder);

        // Delete the old postURL from store
        const urlObj = new URL(blog.picOneURL);
        const fileName = decodeURIComponent(path.basename(urlObj.pathname));
        const folder = "postImages";
        const filePath = `${folder}/${fileName}`;
        await deleteFile(filePath);

        updatedBlog = {
          title,
          excerpt,
          message,
          categories,
          picOne: url,
          picTwo: blog.picTwoURL,
          userId: new Types.ObjectId(userId),
        };
      } else {
        let file = req.files.image2[0];
        const url = await uploadFile(file, folder);

        // Delete the old postURL from store
        const urlObj = new URL(blog.picTwoURL);
        const fileName = decodeURIComponent(path.basename(urlObj.pathname));
        const filePath = `${folder}/${fileName}`;
        await deleteFile(filePath);

        updatedBlog = {
          title,
          excerpt,
          message,
          categories,
          picOne: blog.picOneURL,
          picTwo: url,
          userId: new Types.ObjectId(userId),
        };
      }
    } else {
      updatedBlog = {
        title,
        excerpt,
        message,
        categories,
        picOne: blog.picOneURL,
        picTwo: blog.picTwoURL,
        userId: new Types.ObjectId(userId),
      };
    }

    // Update in the database
    updatedBlog = await Blog.updateOne({ _id: id }, { $set: updatedBlog });

    res
      .status(200)
      .send({ data: updatedBlog, message: "Blog updated successfully!." });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let blog = await Blog.findById(id);

    if (!blog)
      return res.status(404).send("The blog specified is not avilable");

    // Delete the old postURLs from store
    const urls = [blog.picOneURL, blog.picTwoURL];

    for (let url of urls) {
      const urlObj = new URL(url);
      const fileName = decodeURIComponent(path.basename(urlObj.pathname));
      const filePath = `${folder}/${fileName}`;
      await deleteFile(filePath);
    }

    // Delete podcast from db
    blog = await Blog.findByIdAndDelete(id);

    res.status(200).send({ data: blog, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

module.exports = router;
