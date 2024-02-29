const User = require('../models/User');
const ErrorHandler = require('../middleware/errorHandler');

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
            role,
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc  Login user
// @route POST /api/v1/auth/register
// @access Public
// เงื่อนไขการ match ของ email และ password
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error('Please provide an email and password');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
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
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};

// @desc  Get current Logged in user
// @route POST /api/v1/auth/me
// @access Private

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
};

//@desc  Log user out / clear cookie
//@route Get /api/v1/auth/logout
//@acess Private

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
};
