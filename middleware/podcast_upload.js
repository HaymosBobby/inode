const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error('Only audio format allowed!'), false);
    }
  },
}).single("podcast");

module.exports = upload;
