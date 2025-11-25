const { stack } = require("../routes");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status ||500;

    const errorResponse = {
        statusCode: statusCode,
        message: err.message || 'Internal Server Error',
        data: err.data || null,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : "",
    };


    //log lỗi ra console
    console.error(err);

    //gui response lỗi về client
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
