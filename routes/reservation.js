const express = require('express');

const { getReservation, getReservations, addReservation, updateReservation, deleteReservation } = require('../controllers/reservation');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('user','admin'), getReservations)
    .post(protect, authorize('user', 'admin'), addReservation);
router.route('/:id')
    .get(getReservation)
    .put(protect, authorize('user', 'admin'), updateReservation)
    .delete(protect, authorize('user', 'admin'), deleteReservation);


module.exports = router;
