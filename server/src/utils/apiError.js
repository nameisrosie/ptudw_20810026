class  ApiError extends Error {
    constructor(statusCode, message, errors = [], stack = "") {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors;
        this.stack = stack;
        this.success = false;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;