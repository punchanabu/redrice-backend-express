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
        } 

        const reservations = await query;

        res.status(200).json({ success: true, count: reservations.length, data: reservations });

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
            select: 'name description'
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
        const restaurantId = req.body.restaurantId;
        req.body.restaurant = restaurantId;
        req.body.user = req.user.id;
        console.log(req.body);
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const error = new Error('No restaurant found');
            error.statusCode = 404;
            throw error;
        }

        // Check if there is table available for reservation
        if (restaurant.table_available < req.body.numberofTable) {
            const error = new Error(`Not enough table available number of table left: ${restaurant.table_available}`);
            error.statusCode = 400;
            throw error;
        }
        
        // The limit on the number of tables is enforced by the schema itself (`max: 3` on `numberofTable`)
        
        // Create reservation
        const newReservation = await Reservation.create(req.body);

        // Update the restaurant available table
        restaurant.table_available -= req.body.numberofTable;
        await restaurant.save();

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

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            const error = new Error('Not authorized to update appointment');
            error.statusCode = 401;
            throw error;
        }

        appointment = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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

       
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            const error = new Error('Not authorized to delete this reservation');
            error.statusCode = 401;
            throw error;
        }

        
        await reservation.deleteOne();

   
        res.status(200).json({ success: true, data: {}, message: 'Reservation deleted successfully' });
    } catch (err) {
        next(err); 
    }
};
