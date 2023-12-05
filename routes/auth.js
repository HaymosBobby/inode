const _ = require("lodash");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const router = require("express").Router();
const { validateUser, User, validateResetDetails } = require("../models/user");
const validateLoginDetails = require("../models/auth");
const { transporter } = require("../mailchimp/mailchimp");
const { Types } = require("mongoose");

// Register
router.post("/register", async (req, res) => {
  try {
    // Validate user Inputs
    const { error, value } = validateUser(req.body);
    console.log(error);
    if (error) return res.status(400).send({ message: error.message });
    const { username, email, password } = value;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) return res.status(400).send({ message: "User already exists" });

    // Create a hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Generate user token
    // const token = user.generateAuthToken();

    // Save user to database
    const savedUser = await user.save();

    // Send success mail
    const mailOptions = {
      from: "akinbandeamos@gmail.com",
      to: value.email,
      subject: "Sign up Succesful",
      html: `<h2>Successfully signed up!</h2>`,
    };

    res
      // .header("x-auth-token", token)
      .send(_.omit(savedUser.toObject(), ["password"]));

    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Validate user Inputs
    const { error, value } = validateLoginDetails(req.body);
    console.log(error.message);
    if (error) return res.status(400).send(error.message);
    const { log, password } = value;

    // Check for existence of a user
    let user = await User.findOne({
      $or: [{ username: log }, { email: log }],
    });

    if (!user) return res.status(401).send("Invalid Username or Password");

    // Decode user password
    const decryptedPassword = await bcrypt.compare(password, user.password);

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

router.post("/reset-password", async (req, res) => {
  const user = await User.findOne({
    $or: [{ username: req.body.log }, { email: req.body.log }],
  });

  if (!user)
    return res
      .status(404)
      .send({ message: "No account with the details found!" });

  const buffer = crypto.randomBytes(32);
  const token = buffer.toString("hex");
  const expirationDate = Date.now() + 3600000;

  const updatedUser = await User.updateOne(
    {
      $or: [{ username: req.body.log }, { email: req.body.log }],
    },
    {
      $set: {
        resetToken: token,
        resetTokenExpiration: expirationDate,
      },
    }
  );

  // Send success mail
  const mailOptions = {
    from: "akinbandeamos@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `
      <div>
        <h3>Password Reset</h3>
        <p>You requested a password reset.</p>
        <p>Kindly ignore this message if this was not requested by you.</p>
        <p>Kindly click the link below to reset your password</p>
        <div style="display: flex; align-items: center; justify-content: center;">
          <p style="background: #00ff00"; color: #ffffff; padding: 20px;><a style="color: #ffffff" href="http://localhost:5000/api/imedia-auth/reset-password/${token}">Password reset link</a></p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(info);

  res.status(200).send({ message: info.message });
});

router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return res.status(404).send({ message: "User not found!!!" });

  res.status(200).send({
    message: "You can proceed to change your password",
    success: true,
    userId: user._id,
    passwordToken: token,
  });
});

router.post("/new-password", async (req, res) => {
  const { error, value } = validateResetDetails(req.body);
  if (error) {
    return res.status(400).send({ message: error.message });
  }
  const { userId, passwordToken, newPassword } = value;

  const user = await User.findOne({
    _id: new Types.ObjectId(userId),
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return res.status(404).send({ message: "User not found!" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  let updatedUser = {
    password: hashedPassword,
  };

  updatedUser = await User.updateOne(
    {
      _id: new Types.ObjectId(userId),
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    },
    {
      $set: updatedUser,
      $unset: {
        resetToken: "",
        resetTokenExpiration: "",
      },
    }
  );

  res.status(200).send({ message: "Password changed successfully!" });
});

module.exports = router;
