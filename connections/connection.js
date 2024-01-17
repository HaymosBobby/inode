const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (Error) {
    console.log("Can't connect to mongoose to start the server:", Error);
    process.exit(1);
  }
};

module.exports = connection;
