const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  duration: Number,
  releaseDate: Date,
  rating: Number,
  description: String,
  photo: String, // ✅ match the controller and frontend
});

module.exports = mongoose.model('Movie', movieSchema);