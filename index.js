require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const config = require("config");
const connection = require("./connections/connection");
const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

const app = express();
const blogs = require("./routes/blogs");
const podcasts = require("./routes/podcasts");
const programs = require("./routes/programs");
const users = require("./routes/users");
const auth = require("./routes/auth");

// const dns = require('dns');

// dns.resolve("testdomain.com", 'ANY', (err, records) => {
//   if (err) {
//     console.log("Error: ", err);
//   } else {
//     // console.log(records);
//   }
// });

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({"exposedHeaders": "X-Auth-Token" }));

app.use("/api/imedia-blogs", blogs);
app.use("/api/imedia-podcasts", podcasts);
app.use("/api/imedia-programs", programs);
app.use("/api/imedia-users", users);
app.use("/api/imedia-auth", auth);

// const connection = () => {
//   try {
//     mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");
//     const port = process.env.PORT || 3000
//     app.listen(port, () => {
//       console.log(`Listening on port ${port}`)
//     });
//   } catch (err) {
//     console.log("Can't connect to mongoose to start the server", err);
//     process.exit(1)
//   }
// };

connection().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

// mongodb+srv://haymosx:Haymosbobby121@bobbydazzler.ezqpkei.mongodb.net/imedia
