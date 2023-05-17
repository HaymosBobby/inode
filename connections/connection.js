const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Can't connect to mongoose to start the server", err);
    process.exit(1);
  }
};

module.exports = connection;

/*
useNewUrlParser: true,
useFindAndModify: false,
useUnifiedTopology: true,
bufferCommands: false,
autoIndex: false,
}*/
