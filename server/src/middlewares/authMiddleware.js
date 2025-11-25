const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const { User } = require('../models');
const { isTokenBlackListed } = require('../utils/tokenBlackList');

const  authenticateToken = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Thieu token');
        }

        //Kiem tra token co bi thu hoi khong
        if (isTokenBlackListed(token)) {
            throw new ApiError(401, 'Token has been revoked');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            throw new ApiError(401, 'User not found');
        }
        req.user = user; // gán thông tin user vào req để sử dụng trong các middleware hoặc route handler tiếp theo
        req.token = token; // gán token vào req để sử dụng trong các middleware hoặc route handler tiếp theo
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            error = new ApiError(401, 'Invalid token');
        } else if (error.name ==="TokenExpiredError"){
            error = new ApiError(401, 'Token has expired');
        }
        next(error);
    }
};

const requireAdmin = (req, res, next) => {
    try {
        if(!req.user){
            throw new ApiError(401, 'Unauthorized');
        }
        if (req.user.role !== 'Admin') {
            throw new ApiError(403, 'Access denied. Admins only.');
        }
        next();
    } catch (error) {
        next(error);
    }
};
module.exports = {authenticateToken, requireAdmin};