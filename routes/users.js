const auth = require("../middleware/auth");
const router = require("express").Router();
const { User } = require("../models/user");
const admin = require("../middleware/admin");

router.get("/", admin, async (req, res) => {
  try {
    const users = await User.find();

    if (users && users.length <= 0)
      return res.status(404).send("No User found!");

    res.status(200).send({ data: users, message: "Success!" });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error.message);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).send("No user found");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error.message);
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (req.body) return res.status(400).send({ message: "No input set" });

    const updatedUser = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          profilePicUrl: req.body.profilePicUrl,
        },
      }
    );
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error.message);
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found" });

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    res
      .status(200)
      .send({ data: deletedUser, message: "User deleted successfully!." });
  } catch (error) {
    res.status(500).send({ Error: error, message: error.message });
    console.log(error.message);
  }
});

module.exports = router;
