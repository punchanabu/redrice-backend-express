const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// @desc   Get all reservations
// @route  GET /api/v1/reservations
// @access Private
exports.getReservations = async (req, res, next) => {
    try {
        // Build the base of the query 
        let query = Reservation.find().populate({
            path: 'restaurant',
            select: 'name description'
        }).lean(); // use lean for improve the performance :D ???
        
        // Filter based on user role and potential restaurandId
        if (req.user.role !== 'admin') { 
            query.where({ user: req.user.id });
        } else if (req.params.restaurantId) {
            query.where({ restaurant: req.params.restaurantId });
        }

        const reservations = await query;

        res.status(200).json({ success: true, count: reservations.length, data: reservations });

    } catch (err) {
        console.err(err);
        res.status(500).json({ success: false, error: 'Server Error cannot get the Reservations' });
    }
};

// @desc Get single reservation
// @route GET /api/v1/reservations/:id
// @access Public
exports.getReservation = async (req, res, next) => {

    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name description'
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'No reservation found'
            });
        }

        res.status(200).json({ success: true, data: reservation });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Server Error cannot get Reservation' });
    }
};

// @desc Add reservation
// @route POST /api/v1/reservations
// @access Private
exports.addReservation = async (req, res, next) => {
    try {
        req.body.restaurant = req.params.restaurantId;

        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: 'No restaurant found'
            });
        }

        req.body.user = req.user.id;

        const existedReservation = await Reservation.find({
            user: req.user.id
        });

        if (existedReservation.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                error: 'You can only reserve 3 times'
            });
        }

        const appointment = await Reservation.create(req.body);

        res.status(201).json({ success: true, data: appointment });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );

            return res.status(400).json({ success: false, error: messages });
        } else {
            return res
                .status(500)
                .json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc Update reservation
// @route PUT /api/v1/reservations/:id
// @access Private

exports.updateReservation = async (req, res, next) => {
    try {
        let appointment = await Reservation.findById(req.params.id);

        if (!appointment) {
            return res
                .status(404)
                .json({ success: false, error: 'No appointment found' });
        }

        if (
            appointment.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update appointment'
            });
        }

        appointment = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.params.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
