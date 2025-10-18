const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShowTime', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }], // multiple seats
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
