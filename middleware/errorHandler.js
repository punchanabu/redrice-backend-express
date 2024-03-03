// This function will handle all the errors that are thrown in the application
const ErrorHandler = (err, req, res, next) => {
    console.error(err);

    let errorResponse = {
        ...err,
        message: err.message
    };

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        errorResponse = { statusCode: 404, message };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((value) => value.message)
            .join(', ');
        errorResponse = { statusCode: 400, message };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        errorResponse = { statusCode: 400, message };
    }

    res.status(errorResponse.statusCode || 500).json({
        success: false,
        error: errorResponse.message || 'Server Error'
    });
};

module.exports = ErrorHandler;
