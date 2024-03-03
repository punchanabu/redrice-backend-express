const express = require('express');

const {
    getReservation,
    getReservations,
    addReservation,
    updateReservation,
    deleteReservation,
    updateReservationStatus
} = require('../controllers/reservation');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('user', 'admin'), getReservations)
    .post(protect, authorize('user', 'admin'), addReservation);
router
    .route('/:id')
    .get(protect, authorize('user', 'admin'), getReservation)
    .put(protect, authorize('user', 'admin'), updateReservation)
    .delete(protect, authorize('user', 'admin'), deleteReservation);

router.route('/UpdateStatus/:id').put(protect, authorize('user', 'admin'), updateReservationStatus);
module.exports = router;
