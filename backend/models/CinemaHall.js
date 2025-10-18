const mongoose = require('mongoose');

const cinemaHallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: Number,
  location: String,
});

module.exports = mongoose.model('CinemaHall', cinemaHallSchema);
