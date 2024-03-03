const mongoose = require('mongoose');

const ResSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    address: {
        type: String,
        required: [true, 'Please add a address'],
    },
    telephone_number: {
        type: String,
    },
    open_time: {
        type: Date,
        required: [true, 'Please add a Date'],
    },
    close_time: {
        type: Date,
        required: [true, 'Please add a Date'],
    },
    table_available: {
        type: Number,
        required: [true, 'Please add a number of available table'],
    },
    image: {
        type: String,
        required: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Restaurant', ResSchema);
