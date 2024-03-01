const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // ----- ไม่มี token
    // Make sure token exists
    if (!token || token == 'null') {
        return res.status(401).json({
            success: false,
            message: 'Not authorize to access this route',
        });
    }

    // ----- มี token
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this id',
            });
        }
        req.user = user;

        next();
    } catch (err) {
        console.log(err.stack);
        let message = 'Not authorized to access this route';
        if (err.name === 'TokenExpiredError') {
            message = 'Your token has expired, please log in again';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token, please log in again';
        }
        return res.status(401).json({
            success: false,
<<<<<<< HEAD
            message: message,
=======
            message: 'Not authorize to access this route',
>>>>>>> main
        });
    }
};

// Grant access to specific roles
// เช็คว่ามี role ใน list หรือไม่
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: 'No user found in the request',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
