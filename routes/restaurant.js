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
    .post(protect, authorize('admin', 'user'), createRestaurant);

router
    .route('/:id')
    .get(protect, getRestaurant)
    .put(protect, authorize('admin', 'user'), updateRestaurant)
    .delete(protect, authorize('admin', 'user'), deleteRestaurant);

module.exports = router;
