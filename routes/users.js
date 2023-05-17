const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { validateUser, User } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  console.log(req.user);
  const user = await User.findById(req.user._id).select("-password");
  console.log(user);
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: value.email });
  if (user) return res.status(400).send("User already exists");

  let newUser = new User({
    name: value.name,
    email: value.email,
    password: value.password,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(value.password, salt);

  await newUser.save();

  const token = newUser.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["_id", "name", "email"]));
});

module.exports = router;
