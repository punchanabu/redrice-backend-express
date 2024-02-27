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
        const token = user.getSignedJwtToken();

        res.status(200).json({ success: true, token });
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
        return res
            .status(400)
            .json({
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
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
};
