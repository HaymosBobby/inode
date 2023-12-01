require("dotenv").config();
const express = require("express");
const config = require("config");
const connection = require("./connections/connection");
const cors = require("cors");

const app = express();
const blogs = require("./routes/blogs");
const podcasts = require("./routes/podcasts");
const programs = require("./routes/programs");
const users = require("./routes/users");
const auth = require("./routes/auth");
const test = require("./routes/test");
const category = require("./routes/category");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ exposedHeaders: "X-Auth-Token" }));

app.use("/api/imedia-blogs", blogs);
app.use("/api/imedia-podcasts", podcasts);
app.use("/api/imedia-programs", programs);
app.use("/api/imedia-users", users);
app.use("/api/imedia-auth", auth);
app.use("/api/imedia-categories", category);
app.use("/api/test", test);

const connect = async () => {
  try {
    await connection();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log("Cannot connect to MongoDb to start the server", error);
  }
};

connect();
