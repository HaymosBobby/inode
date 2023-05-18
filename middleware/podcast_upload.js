const multer = require("multer");
// const storage = require("../gridfs/podcastGrid")

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/podcasts/");
//   },
//   filename: (req, file, cb) => {
//     // cb(null, file.originalname)
//     cb(null, `imedia-${Date.now()}-${file.originalname}`);
//     // "imedia" + "-" + Date.now() +
//   },
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "IMEDIA_PODCASTS",
//   },
// });

const upload = multer({
  // storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error('Only audio format allowed!'), false);
    }
  },
}).single("podcast");

module.exports = upload;
