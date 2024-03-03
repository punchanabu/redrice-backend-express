const express = require('express');
const upload = require('../config/gridfs');
const {
    getRestaurant,
    createRestaurant,
    deleteRestaurant,
    updateRestaurant,
    getRestaurants,
    getRestaurantImage,
} = require('../controllers/restaurant');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getRestaurants)
    .post(
        protect,
        authorize('admin'),
        upload.single('image'),
        createRestaurant,
    );

router
    .route('/:id')
    .get(getRestaurant)
    .put(protect, authorize('admin'), updateRestaurant)
    .delete(protect, authorize('admin'), deleteRestaurant);

router.route('/image/:filename').get(getRestaurantImage);
module.exports = router;
