const express = require("express");
const router = express.Router();
const productRouter = require("./productRouter");
const authRouter = require("./authRouter");

router.use("/products", productRouter);
//router.use('/auth', authRouter);
router.use("/auth", authRouter);
router.use("/categories", require("./categoryRouter"));
module.exports = router;
