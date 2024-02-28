const Reservation = require('./Reservation');
const Restaurant = require('./Restaurant');
// @desc   Get all reservations
// @route  GET /api/v1/reservations
// @access Private
exports.getReservations = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'restaurant',
            select: 'name description',
        });
    } else {
        if (req.params.restaurantId) {
            query = Reservation.find({
                restaurant: req.params.restaurantId,
            }).populate({
                path: 'restaurant',
                select: 'name description',
            });
        } else {
            query = Reservation.find().populate({
                path: 'restaurant',
                select: 'name description',
            });
        }
    }
};

// @desc Get single reservation
// @route GET /api/v1/reservations/:id
// @access Public
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name description',
        });

        if (!reservation) {
            return next(
                new ErrorResponse(
                    `Reservation not found with id of ${req.params.id}`,
                    404,
                ),
            );
        }

        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Server Error' });
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
            return next(
                new ErrorResponse(
                    `Restaurant not found with id of ${req.params.restaurantId}`,
                    404,
                ),
            );
        }

        req.body.user = req.user.id;

        const existedReservation = await Reservation.find({
            user: req.user.id,
        });

        if (existedReservation.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                error: 'You can only reserve 3 times',
            });
        }

        const appointment = await Reservation.create(req.body);

        res.status(201).json({ success: true, data: appointment });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(
                (val) => val.message,
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
                error: 'Not authorized to update appointment',
            });
        }

        appointment = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.params.body,
            {
                new: true,
                runValidators: true,
            },
        );

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
