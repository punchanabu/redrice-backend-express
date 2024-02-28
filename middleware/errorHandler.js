// This function will handle all the errors that are thrown in the application
const ErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500; 
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: errorMessage,
    });
};

module.exports = ErrorHandler;