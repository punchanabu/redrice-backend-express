const express = require('express');

const { getReservation, getReservations, createReservation, updateReservation, deleteReservation } = require('../controllers/reservation');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getReservations)
    .post(protect, authorize('user', 'admin'), createReservation);
router.route('/:id')
    .get(getReservation)
    .put(protect, authorize('user', 'admin'), updateReservation)
    .delete(protect, authorize('user', 'admin'), deleteReservation);

    
module.exports = router;
