const multer = require("multer");

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "public/programs/");
  // },
  filename: (req, file, cb) => {
    // cb(null, file.originalname)
    cb(null, `imedia-${Date.now()}-${file.originalname}`);
    // "imedia" + "-" + Date.now() +
  },
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "IMEDIA_PODCASTS",
//   },
// });

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error('Only image format allowed!'), false);
    }
  },
}).single("pic");

module.exports = upload;
