require("express-async-errors");
const express = require("express");
const controller = {};
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { Product, Category, Tag, Image, Review, User } = require("../models");
const { Op, where } = require("sequelize");

controller.getAllProducts = async (req, res) => {
  let {
    search,
    categoryId,
    tagId,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort = "newest",
    sortOrder = "asc",
  } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let options = {
    where: {},
    limit: limitNum,
    offset: offset,
    include: [
      { model: Category, attributes: ["id", "name"], required: false },
      {
        model: Tag,
        through: { attributes: [] }, //Không lấy attributes từ bảng trung gian
        attributes: ["id", "name"],
        required: false,
      },
    ],
    distinct: true, //Đảm bảo không bị trùng khi join many-to-many
  };

  //Loc theo search
  if (search) {
    options.where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { summary: { [Op.iLike]: `%${search}%` } },
    ];
  }

  //Loc theo categoryId
  if (categoryId) {
    if (isNaN(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }
    categoryId = parseInt(categoryId);
    options.where.categoryId = categoryId;
  }
  //Loc theo tagId
  if (tagId) {
    if (isNaN(tagId)) {
      throw new ApiError(400, "Invalid tag ID");
    }
    tagId = parseInt(tagId);
    options.include[1].where = { id: tagId };
    options.include[1].required = true;
  }

  //Loc theo khoang gia
  if (minPrice || maxPrice) {
    options.where.price = {};

    if (minPrice) {
      if (isNaN(minPrice)) {
        throw new ApiError(400, "minPrice phai la so");
      }
      minPrice = parseFloat(minPrice);
      options.where.price[Op.gte] = minPrice;
    }

    if (maxPrice) {
      if (isNaN(maxPrice)) {
        throw new ApiError(400, "maxPrice phai la so");
      }
      maxPrice = parseFloat(maxPrice);
      options.where.price[Op.lte] = maxPrice;
    }
  }

  //sort
  const validSortFields = {
    newest: { sortBy: "createdAt", sortOrder: "DESC" },
    price_asc: { sortBy: "price", sortOrder: "ASC" },
    price_desc: { sortBy: "price", sortOrder: "DESC" },
    name_asc: { sortBy: "name", sortOrder: "ASC" },
    name_desc: { sortBy: "name", sortOrder: "DESC" },
  };
  const validSortOrders = ["asc", "desc"];
  if (Object.keys(validSortFields).includes(sort)) {
    const validSort = validSortFields[sort];
    options.order = [[validSort.sortBy, validSort.sortOrder]];
  } else {
    options.order = [["createdAt", "desc"]];
  }

  //truy vấn lấy sản phẩm từ database với các tùy chọn đã xây dựng
  const { count, rows } = await Product.findAndCountAll(options);

  //Kiểm tra nếu không có sản phẩm nào sau khi lọc
  if (rows.length === 0) {
    throw new ApiError(404, "No products found matching the criteria");
  }

  const responseData = {
    products: rows,
    pagination: {
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
    filters: {
      search: search || "",
      categoryId: categoryId || null,
      tagId: tagId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      limit: limitNum,
      page: pageNum,
      sort: sort,
    },
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Products retrieved successfully")
    );
};

controller.getProductById = async (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    throw new ApiError(400, "Invalid product ID");
  }
  id = parseInt(id);
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Image,
        attributes: ["id", "imagePath", "altText", "displayOrder"],
        orderBy: [["displayOrder", "ASC"]],
      },
      {
        model: Review,
        attributes: ["id", "userId", "title", "rating", "comment"],
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "profileImage"],
          },
        ],
      },
      { model: Category, attributes: ["id", "name"], required: false },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name"],
        required: false,
      },
    ],
  });
  if (!product) {
    throw new ApiError(404, `Product with ID ${id} not found`);
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        `Product details for product ID: ${id} from controller`
      )
    );
};

controller.createProduct = async (req, res) => {
  const { name, description, price, categoryId, imagePath, summary } = req.body;
  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (!price) {
    throw new ApiError(400, "price is required");
  }
  if (isNaN(price) || isNaN(categoryId)) {
    throw new ApiError(400, "Price and Category ID must be numbers");
  }
  let newProduct = {
    name,
    price,
  };

  if (description) newProduct.description = description;
  if (categoryId) newProduct.categoryId = parseInt(categoryId);
  if (imagePath) newProduct.imagePath = imagePath;
  if (summary) newProduct.summary = summary;

  newProduct = await Product.create(newProduct);
  res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
};

controller.updateProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { name, description, price, categoryId, imagePath, summary } = req.body;
    if (!name) {
      throw new ApiError(400, "Name is required");
    }
    if (!price) {
      throw new ApiError(400, "price is required");
    }
    if (isNaN(price) || isNaN(categoryId)) {
      throw new ApiError(400, "Price and Category ID must be numbers");
    }
    id = parseInt(id);
    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) {
      if (isNaN(price)) {
        throw new ApiError(400, "Price must be a number");
      }
      product.price = parseFloat(price);
    }
    if (categoryId) {
      if (isNaN(categoryId)) {
        throw new ApiError(400, "Category ID must be a number");
      }
      categoryId = parseInt(categoryId);
      let category = await Category.findByPk(categoryId);
      if (!category) {
        throw new ApiError(404, `Category with ID ${categoryId} not found`);
      }
      product.categoryId = parseInt(categoryId);
    }
    if (imagePath) product.imagePath = imagePath;
    if (summary) product.summary = summary;
    await product.save();

    res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

controller.deleteProduct = async (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    throw new ApiError(400, "Invalid product ID");
  }
  id = parseInt(id);
  let product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, `Product with ID ${id} not found`);
  }
  await product.destroy({ where: { id: id } });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
};

module.exports = controller;
