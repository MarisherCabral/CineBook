const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

exports.addBooking = async (req, res) => {
  try {
    const { showtimeId, seatIds, movieId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    if (!showtimeId || !seatIds || seatIds.length === 0 || !movieId) {
      return res.status(400).json({ msg: 'Movie, showtime, and seats are required.' });
    }

    const seatIdsStr = seatIds.map(id => id.toString());

    // Check already booked seats
    const alreadyBooked = await Seat.find({
      _id: { $in: seatIdsStr },
      isBooked: true
    });

    if (alreadyBooked.length > 0) {
      return res.status(400).json({ msg: 'Some selected seats are already booked.' });
    }

    // Save booking
    const booking = new Booking({
      customerId: req.user.id,
      showtimeId,
      movieId,
      seatIds: seatIdsStr,
      status: 'Confirmed'
    });

    await booking.save();

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: seatIdsStr } },
      { isBooked: true }
    );

    return res.json({ msg: 'Booking successful!', booking });
  } catch (err) {
    console.error('Booking failed:', err);
    return res.status(500).json({ msg: 'Booking failed', error: err.message });
  }
};

// Get seats by showtime
exports.getSeatsByShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const seats = await Seat.find({ showtime: id });
    const seatsFormatted = seats.map(s => ({
      id: s._id.toString(),
      label: s.seatNumber,
      occupied: s.isBooked
    }));
    res.json(seatsFormatted);
  } catch (err) {
    console.error('Error fetching seats:', err);
    res.status(500).json({ msg: 'Error fetching seats', error: err.message });
  }
};
