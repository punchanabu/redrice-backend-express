const Reservation = require('../models/Reservation'); // Assuming 'Reservation' model is exported

// Function to update reservation status
async function updateReservationStatus(reservationId, newStatus) {
  try {
    // Find the reservation by ID
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { $set: { status: newStatus } },
      { new: true } // Return the updated document
    );

    if (!reservation) {
      throw new Error(`Reservation with ID ${reservationId} not found`);
    }

    // Return the updated reservation
    return reservation;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling
  }
}
module.exports = updateReservationStatus;