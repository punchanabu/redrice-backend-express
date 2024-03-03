const express = require('express');
const upload = require('../config/multer');
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
    .post(
        protect,
        authorize('admin', 'user'),
        upload.single(image),
        createRestaurant,
    );

router
    .route('/:id')
    .get(protect, getRestaurant)
    .put(protect, authorize('admin', 'user'), updateRestaurant)
    .delete(protect, authorize('admin', 'user'), deleteRestaurant);

module.exports = router;
