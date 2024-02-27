const User = require('../models/User');

//@desc  Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = (req, res, next) => {
    res.status(200).json({ success: true });
};
