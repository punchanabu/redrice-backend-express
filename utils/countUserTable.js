const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');

async function countUserReservations(restaurantId, userId) {
    try {

        // Validate restaurantId
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new Error('Invalid restaurantId');
        }
        
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId');
        }

        const result = await Reservation.aggregate([
            {
                $match: {
                    restaurant: new mongoose.ObjectId(restaurantId),
                    user: new mongoose.ObjectId(userId),
                }
            },
            {
                $group: {
                    _id: null, 
                    count: { $sum: 1 } 
                }
            }
        ]);

        
        return result.length > 0 ? result[0].count : 0;
    } catch (err) {
        console.error('Error in countUserReservations:', err.message);
        throw err;
    }
}

module.exports = countUserReservations;