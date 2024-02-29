async function checkForOverlappingReservation(
    restaurantId,
    tableNumbers,
    startTime,
    endTime,
) {
    const overlappingReservations = await Reservation.find({
        restaurantId: restaurantId,
        tableNumber: { $in: tableNumbers },
        $or: [
            {
                startTime: { $lt: endTime, $gte: startTime },
                endTime: { $gt: startTime, $lte: endTime },
            }, // if this is true, then the reservation overlaps with the new reservation
        ],
    });

    return overlappingReservations.length > 0;
}
