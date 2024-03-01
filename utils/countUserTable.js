const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');

async function countUserTable(restaurantId, userId) {
    try {
        // Check if restaurantId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new Error('Invalid restaurantId');
        }
        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId');
        }

        const result = await Reservation.aggregate([
            {
                $match: {
                    restaurant: new mongoose.Types.ObjectId(restaurantId),
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    _id: null, // Grouping by null to aggregate the count for all matching documents
                    totalTables: { $sum: { $size: '$tableNumber' } }, // Calculate the total number of tables
                },
            },
        ]);

        // Return the totalTables count or 0 if no reservations are found
        return result.length > 0 ? result[0].totalTables : 0;
    } catch (err) {
        console.error('Error in countUserTable:', err.message);
        throw err; // Ensure the error is thrown with the correct message
    }
}

module.exports = countUserTable;
