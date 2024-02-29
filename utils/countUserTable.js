const Reservation = require('../models/Reservation');

async function countUserTable(restaurantId, userId) {
    const result = await Reservation.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                restaurant: mongoose.Types.ObjectId(restaurantId),
            },
        },
        { $unwind: '$tableNumber' },
        { $group: { _id: '$user', totalTable: { $sum: 1 } } },
    ]);

    return result.length > 0 ? result[0].totalTables : 0;
}

module.exports = countUserTable;
