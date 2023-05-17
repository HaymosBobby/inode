const multer = require("multer");

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "public/uploads/");
  // },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, `imedia-${Date.now()}-${file.originalname}`);
    // "imedia" + "-" + Date.now() +
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error('Only image format allowed!'), false);
    }
  },
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

module.exports = upload;
