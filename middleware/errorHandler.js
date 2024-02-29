// This function will handle all the errors that are thrown in the application
const ErrorHandler = (err, req, res, next) => {
    console.error(err);

    let err = { ...err };
    err.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        err = new ErrorResponse(message, 404);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message);
        err = new ErrorResponse(message, 400);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        err = new ErrorResponse(message, 400);
    }

    res.status(statusCode || 500).json({
        success: false,
        error: errorMessage || 'Server Error',
    });
};

module.exports = ErrorHandler;
