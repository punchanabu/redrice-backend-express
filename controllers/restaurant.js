// Import any necessary modules or dependencies
const Restaurant = require('../models/Restaurant');
// Define your controller function
exports.createRestaurant = async (req, res, next) => {
    try {
        console.log(req.body);
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: `Cannot create Restaurant` });
    }
};
exports.updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: `No Restaurant with the id of ${req.params.id}` });
        }

        // Make sure user is the restaurant owner
        if (restaurant.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User  ${req.params.id} is not authorized to update this Restaurant` });
        }
        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: `Cannot Update to appointments` });
    }
};

exports.deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: `No restaurant with the id of ${req.params.id}` });
        }
        // Make sure user is the restaurant owner
        if (restaurant.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.params.id} is not authorized to delete this bootcamp` });
        }
        await restaurant.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: `Cannot delete to Restaurant` });
    }
};
exports.getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: `No restaurant with ths id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Cannot find Restaurant' });
    }
};

exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.find();
        res.status(200).json({
            success: true,
            count: restaurant.length,
            data: restaurant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Restaurant'
        });
    }
};
