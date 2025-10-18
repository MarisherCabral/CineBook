const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  hall: { type: String, required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'ShowTime', required: true },
  isBooked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Seat', seatSchema);
