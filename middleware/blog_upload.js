const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only image format allowed!"), false);
    }
  },
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

module.exports = upload;
