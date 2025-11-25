const express = require('express');
const controller = require('../controllers/authController');
const router = express.Router();
const {authenticateToken} = require('../middlewares/authMiddleware');

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", authenticateToken, controller.logout); // Hoặc thay bằng DELETE tùy thiết kế API

module.exports = router;