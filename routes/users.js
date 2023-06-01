const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { validateUser, User } = require("../models/user");

router.get("/", auth, async (req, res) => {
  const users = await User.find();

  res.status(200).send(users);
});

router.get("/me", async (req, res) => {
  // console.log(req.user);
  const user = await User.findById(req.user._id).select("-password");
  // console.log(user);
  res.send(user);
});

module.exports = router;

































