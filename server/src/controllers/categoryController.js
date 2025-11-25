const controller = {};
const { Product, Category } = require("../models");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

controller.getAllCategories = async (req, res) => {
  const options = {
    attributes: ["id", "name"],
    include: [{ model: Product, attributes: ["id"] }],
  };
  const categories = await Category.findAll(options);
  res
    .status(200)
    .json(new apiResponse(200, categories, "List of all categories"));
};

module.exports = controller;
