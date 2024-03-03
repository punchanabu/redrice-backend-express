const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const conn = mongoose.createConnection(process.env.MONGO_URI);
// Initialize GridFSBucket
let bucket;
conn.once('open', () => {
    bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    console.log('Open a tcp connection to GridFS bucket 🚀');
});

// @desc   Create new Restaurant
// @route  POST /api/v1/restaurants
// @access Private
exports.createRestaurant = async (req, res, next) => {
    try {
        const restaurantData = req.body;

        if (req.file) {
            const fileName =  req.file.filename;
            restaurantData.image = `http://localhost:5000/api/v1/restaurants/image/${fileName}`
        }

        const restaurant = await Restaurant.create(restaurantData);

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

// @desc  Get Restaurant Image
// @route GET /api/v1/restaurants/image/:filename
// @access Public
exports.getRestaurantImage = async (req, res, next) => {
    try {

        if (!bucket) {
            return res.status(500).json({ err: 'GridFS not initialized' });
        }

        const file = await bucket
            .find({ filename: req.params.filename })
            .toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file found' });
        }

        // Set content type for better browser handling
        res.set('Content-Type', file[0].contentType);

        const readStream = bucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ err: 'Error fetching image' });
    }
};
