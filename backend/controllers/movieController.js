const Movie = require('../models/Movie');

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    console.log("📸 Incoming file:", req.file); // <-- ADD THIS LINE
    console.log("📝 Incoming body:", req.body); // optional

    const { title, description, genre, duration, releaseDate, rating } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : ''; // save file path

    const movie = new Movie({
      title,
      description,
      genre,
      duration,
      releaseDate,
      rating,
      photo,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
