const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const checkForOverlappingReservation = require('../utils/checkOverlappingReservation');
const countUserTable = require('../utils/countUserTable');

// @desc   Get all reservations
// @route  GET /api/v1/reservations
// @access Private
exports.getReservations = async (req, res, next) => {
    try {
        // Build the base of the query
        let query = Reservation.find()
            .populate({
                path: 'restaurant',
                select: 'name description',
            })
            .lean(); // use lean for improve the performance :D ???

        // Filter based on user role and potential restaurandId

        if (req.user.role !== 'admin') {
            query.where({ user: req.user.id });
        }

        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations,
        });
    } catch (err) {
        next(err);
    }
};

// @desc Get single reservation
// @route GET /api/v1/reservations/:id
// @params id
// @access Public
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name description',
        });

        if (!reservation) {
            const error = new Error('No reservation found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        next(err);
    }
};

// @desc Add reservation
// @route POST /api/v1/reservations
// @params restaurantId
// @body numberofTable, date
// @access Private
exports.addReservation = async (req, res, next) => {
    try {
        const {
            restaurantId,
            tableNumber,
            startTime: rawStartTime,
            endTime: rawEndTime,
        } = req.body;
        const userId = req.user.id;
        // Validate the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const error = new Error('No restaurant found');
            error.statusCode = 404;
            throw error;
        }

        // Convert startTime to Date object and ensure it's valid
        let startTime = new Date(rawStartTime);
        if (isNaN(startTime.getTime())) {
            throw new Error('Invalid start time');
        }

        // If the endTime is not provided, set it to startTime + 1 hour
        let endTime = rawEndTime
            ? new Date(rawEndTime)
            : new Date(startTime.getTime() + 60 * 60 * 1000);

        // Check for overlapping reservations
        const isOverlapping = await checkForOverlappingReservation(
            Reservation,
            restaurantId,
            tableNumber,
            startTime,
            endTime,
        );
        if (isOverlapping) {
            const error = new Error(
                'There is already a reservation for this time slot',
            );
            error.statusCode = 404;
            throw error;
        }

        // Check the total numbers of table already booked by user to ensure it does not exceed 3
        const totalTablesBooked = await countUserTable(restaurantId, userId);
        if (totalTablesBooked + tableNumber.length > 3) {
            const error = new Error(
                'You cannot book more than 3 tables per account!',
            );
            error.statusCode = 400;
            throw error;
        }

        req.body.restaurant = restaurantId;
        req.body.user = userId; // Ensure userId is correctly defined and passed here

        // Create reservation
        const newReservation = await Reservation.create(req.body);

        res.status(201).json({ success: true, data: newReservation });
    } catch (err) {
        next(err);
    }
};

// @desc Update reservation
// @route PUT /api/v1/reservations/:id
// @params id
// @body numberofTable, date
// @access Private
exports.updateReservation = async (req, res, next) => {
    try {
        let appointment = await Reservation.findById(req.params.id);

        if (!appointment) {
            const error = new Error('No appointment found');
            error.statusCode = 404;
            throw error;
        }

        if (
            appointment.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            const error = new Error('Not authorized to update appointment');
            error.statusCode = 401;
            throw error;
        }

        appointment = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

// @desc Delete reservation
// @route DELETE /api/v1/reservations/:id
// @params id
// @access Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            const error = new Error('No reservation found');
            error.statusCode = 404;
            throw error;
        }

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            const error = new Error(
                'Not authorized to delete this reservation',
            );
            error.statusCode = 401;
            throw error;
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Reservation deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};
