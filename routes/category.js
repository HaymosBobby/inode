const router = require("express").Router();
const admin = require("../middleware/admin");
const { Category, validateCategory } = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories && categories.length <= 0)
      return res.status(404).send({ message: "No Categories found" });

    res.status(200).send({ data: categories, message: "Success!." });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error);
  }
});

router.post("/", admin, async (req, res) => {
  try {
    // Check for existence of input data
    if (!req.body) return res.status(400).send({ message: "No input found!" });

    // Validate input data
    const { error, value } = validateCategory(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if category already exists
    let category = await Category.findOne({ name: value.name });
    if (category)
      return res.status(400).send({ message: "Category already exists!." });
    // Create new category
    category = new Category({
      name: value.name,
    });

    // Save to datebase
    const savedCategory = await category.save();

    res.status(200).send({
      data: savedCategory,
      message: "Category created successfully!.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error);
  }
});

router.put("/:id", admin, async (req, res) => {
  const id = req.params.id;

  try {
    // Check for existence of category
    const category = await Category.findById(id);
    if (!category) return res.status(404).send("Category not found!.");

    // Check for existence of  input data.
    if (!req.body) return res.status(400).send("No input set");

    // Validate Input
    const { error, value } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create updated category
    let updatedCategory = {
      name: value.name,
    };

    // Update in the database
    updatedCategory = await Category.updateOne(
      { _id: id },
      { $set: updatedCategory }
    );

    res.status(200).send({
      data: updatedCategory,
      message: "Category updated successfully!.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;

  try {
    let category = await Category.findById(id);

    if (!category)
      return res.status(404).send("The category specified is not avilable");

    category = await Category.findByIdAndDelete(id);

    res
      .status(200)
      .send({ data: category, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, Error: error });
    console.log(error.message);
  }
});

module.exports = router;
