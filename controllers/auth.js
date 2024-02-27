const User = require('../models/User');

//@desc  Register user
//@route POST /api/v1/auth/register
//@access Public
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

        // create token
        // const token = user.getSignedJwtToken();

        // res.status(200).json({ success: true, token });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};

//@desc  Login user
//@route POST /api/v1/auth/register
//@access Public
// เงื่อนไขการ match ของ email และ password
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: 'Please provide an email and password',
        });
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res
            .status(400)
            .json({ success: false, msg: 'Invalid credentials' });
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res
            .status(401)
            .json({ success: false, msg: 'Invalid credentials' });
    }

    // create token
    // const token = user.getSignedJwtToken();

    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
// ส่ง token ไป cookie
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
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
