const Restaurant = require('../models/Restaurant');

// @desc   Create new Restaurant
// @route  POST /api/v1/restaurants
// @access Private
exports.createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

// @desc  Get Restaurant by ID
// @route GET /api/v1/restaurants/:id
// @access Public
exports.getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            const error = new Error(
                `No Restaurant with the id of ${req.params.id}`
            );
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (err) {
        next(err);
    }
};

// @desc  Get all Restaurants
// @route GET /api/v1/restaurants
// @access Public
exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.find();
        res.status(200).json({
            success: true,
            count: restaurant.length,
            data: restaurant
        });
    } catch (error) {
        next(error);
    }
};

// @desc  Update Restaurant
// @route PUT /api/v1/restaurants/:id
// @access Private

exports.updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            const error = new Error(
                `No Restaurant with the id of ${req.params.id}`
            );
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin') {
            const error = new Error(
                `User ${req.params.id} is not authorized to update this Restaurant`
            );
            error.statusCode = 401;
            throw error;
        }

        restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

// @desc  Delete Restaurant
// @route DELETE /api/v1/restaurants/:id
// @access Private
exports.deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            const error = new Error(
                `No Restaurant with the id of ${req.params.id}`
            );
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin') {
            const error = new Error(
                `User ${req.params.id} is not authorized to delete this Restaurant`
            );
            error.statusCode = 401;
            throw error;
        }

        await restaurant.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
