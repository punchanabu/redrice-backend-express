const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required: [true, 'Please add a dateTime for this reservation']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user for this reservation']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Please add a restaurant for this reservation']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
