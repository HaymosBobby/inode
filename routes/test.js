const uploadFile = require("../firebase/firebase");
const multer = require("multer");

const storage = multer.memoryStorage();
// const upload = multer({ storage }).single("image");
const upload = multer({ storage }).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

const router = require("express").Router();

router.post("/", upload, async (req, res) => {
  try {
    // console.log(req.files);
    let urls = [];
    if (!req.files) return res.status(400).send("No file sent");

    const files = [req.files.image1[0], req.files.image2[0]];

    for (let file of files) {
      const response = await uploadFile(file);
      urls.push(response);
    }

    // console.log(response);

    res.status(200).send({ data: urls, message: "Upload successful" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
