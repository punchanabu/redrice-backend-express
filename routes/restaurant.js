const express = require('express');
const {
    getRestaurant,
    createRestaurant,
    deleteRestaurant,
    updateRestaurant,
    getRestaurants,
} = require('../controllers/restaurant');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getRestaurants)
    .post(protect, authorize('admin'), createRestaurant);

router
    .route('/:id')
    .get(protect, getRestaurant)
    .put(protect, authorize('admin'), updateRestaurant)
    .delete(protect, authorize('admin'), deleteRestaurant);

module.exports = router;
