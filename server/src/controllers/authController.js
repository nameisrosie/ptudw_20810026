require("express-async-errors");
const express = require("express");
const jwt = require("jsonwebtoken");
const controller = {};
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { User } = require("../models");
const { Op, where } = require("sequelize");
const { addTokenToBlackList } = require("../utils/tokenBlackList");
const bcrypt = require("bcrypt");

controller.register = async (req, res) => {
  const { firstName, lastName, password, confirmPassword, email, phoneNumber } =
    req.body;

  //Kiểm tra dữ liệu bắt buộc
  if (!firstName || !lastName || !password || !confirmPassword || !email) {
    throw new ApiError(400, "All fields are required");
  }

  //Kiểm tra format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  //Kiểm tra chiều dài password
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  //Kiểm tra password và confirmPassword có giống nhau không
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  //Kiểm tra email đã được đăng ký chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Tạo người dùng mới
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword, //Lưu ý: Trong thực tế, cần hash password trước khi lưu
    phoneNumber,
    role: "User", //Mặc định role là 'user'
  });

  const userResponse = {
    ...newUser.toJSON(),
  };
  delete userResponse.hashedPassword; //Xoá trường hashedPassword khỏi response

  res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User registered successfully"));
};

controller.login = async (req, res) => {
  const { email, password } = req.body;

  //Kiem tra dữ liệu bắt buộc
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  //Tìm người dùng theo email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  //So sánh password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  //tạo jwt token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  const userResponse = {
    ...user.toJSON(),
  };
  delete userResponse.password; //Xoá trường password khỏi response

  res
    .status(200)
    .json(new ApiResponse(200, { userResponse, token }, "Login successful"));
};

controller.logout = async (req, res) => {
  const token = req.token;
  //Trong thực tế, bạn có thể lưu token vào blacklist để vô hiệu hoá nó
  if (token) {
    addTokenToBlackList(token);
  } else {
    throw new ApiError(400, "No token provided");
  }
  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
};

module.exports = controller;
