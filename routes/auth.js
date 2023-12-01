const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const { validateUser, User } = require("../models/user");
const validateLoginDetails = require("../models/auth");

// Register
router.post("/register", async (req, res) => {
  try {
    // Validate user Inputs
    const { error, value } = validateUser(req.body);
    if (error) return res.status(400).send({ message: error.message });

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });

    if (user) return res.status(400).send({ message: "User already exists" });

    // Create a hashed password
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(value.password, salt);

    // Create a new user
    user = new User({
      username: value.username,
      email: value.email,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate user token
    // const token = user.generateAuthToken();

    res
      // .header("x-auth-token", token)
      .send(_.omit(savedUser.toObject(), ["password"]));
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Validate user Inputs
    const { error, value } = validateLoginDetails(req.body);
    if (error) return res.status(400).send(error.message[0]);

    // Check for existence of a user
    let user = await User.findOne({
      $or: [{ username: value.log }, { email: value.log }],
    });

    if (!user) return res.status(401).send("Invalid Username or Password");

    // Decode user password
    const decryptedPassword = await bcrypt.compare(
      value.password,
      user.password
    );

    if (!decryptedPassword)
      return res.status(401).send("Invalid Username or Password!!!");

    const token = user.generateAuthToken();
    
    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.omit(user.toObject(), ["password"]));
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

module.exports = router;
