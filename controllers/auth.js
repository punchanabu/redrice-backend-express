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
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};
