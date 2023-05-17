const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require("crypto");
const connection = require("../connections/connection");
const path = require("path");

connection;

const conn = mongoose.createConnection(process.env.MONGO_URI);
conn.once("open", () => {
  let gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("podcasts");
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        fileInfo = {
          filename: filename,
          bucketName: "podcasts",
        };
        resolve(fileInfo);
      });
    });
  },
});

module.exports = storage;
