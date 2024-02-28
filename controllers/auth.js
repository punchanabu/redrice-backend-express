const User = require('../models/User');

// @desc  Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, telephone, password, role } = req.body;

        // create user
        const user = await User.create({
            name,
            email,
            telephone,
            password,
            role
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(new ErrorHandler(err.message, 400));
    }
};

// @desc  Login user
// @route POST /api/v1/auth/register
// @access Public
// เงื่อนไขการ match ของ email และ password
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

   
    if (!email || !password) {
        return next(new ErrorHandler('Please provide an email and password', 400));
    }

    try {
        
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};


// Get token from model, create cookie and send response
// ส่ง token ไป cookie
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

// @desc  Get current Logged in user
// @route POST /api/v1/auth/me
// @access Private

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};
