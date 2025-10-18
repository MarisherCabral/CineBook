const ShowTime = require('../models/ShowTime');
const Seat = require('../models/Seat');

// GET all showtimes with populated movie info
exports.getShowTimes = async (req, res) => {
  try {
    const showtimes = await ShowTime.find()
      .populate('movie') // ✅ populate movie to get title, photo, etc.
      .sort({ startTime: 1 });

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD a new showtime with seats
exports.addShowTime = async (req, res) => {
  try {
    const { movieId, hall, date, time, price, totalSeats } = req.body;

    if (!movieId || !hall || !date || !time || !price || !totalSeats) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const startTime = new Date(`${date}T${time}`);

    const showtime = new ShowTime({
      movie: movieId,
      hall,
      startTime,
      price,
      totalSeats,
    });

    await showtime.save();

    // Generate seats dynamically
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        seatNumber: `A${i}`,
        hall,
        showtime: showtime._id,
        isBooked: false,
      });
    }
    await Seat.insertMany(seats);

    const populatedShowtime = await ShowTime.findById(showtime._id).populate('movie');

    res.status(201).json({
      msg: 'Showtime created successfully',
      showtime: populatedShowtime,
    });
  } catch (err) {
    console.error('❌ Error adding showtime:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE showtime and seats
exports.deleteShowTime = async (req, res) => {
  try {
    const showtimeId = req.params.id;
    await ShowTime.findByIdAndDelete(showtimeId);
    await Seat.deleteMany({ showtime: showtimeId });
    res.json({ msg: 'Showtime and seats deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
