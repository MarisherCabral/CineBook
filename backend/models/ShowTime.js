const mongoose = require('mongoose');

const showTimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  hall: { type: String, required: true },
  startTime: { type: Date, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, default: 20 }, // ✅ dynamic total seats
});

module.exports = mongoose.model('ShowTime', showTimeSchema);
