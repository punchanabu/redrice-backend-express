async function checkForOverlappingReservation (
    Reservation,
    restaurantId,
    tableNumbers,
    startTime,
    endTime
) {
    const overlappingReservations = await Reservation.find({
        restaurant: restaurantId,
        tableNumber: { $in: tableNumbers },
        $or: [
            {
                $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } }
                ]
            }
        ]
    });

    return overlappingReservations.length > 0;
}

module.exports = checkForOverlappingReservation;
