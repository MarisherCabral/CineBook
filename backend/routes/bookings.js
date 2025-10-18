const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/authMiddleware');
const { addBooking, getSeatsByShowtime } = require('../controllers/bookingController');
const Booking = require('../models/Booking');

// User: book seats
router.post('/', auth, addBooking);

// User: get seats for showtime
router.get('/showtime/:id', auth, getSeatsByShowtime);

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('movieId', 'title photo') // <-- added photo
      .populate('showtimeId', 'startTime hall')
      .populate('seatIds', 'seatNumber hall');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ msg: 'Error fetching user bookings', error: err.message });
  }
});


// Admin: view all bookings
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'username')
      .populate('movieId', 'title photo')
      .populate('showtimeId', 'startTime hall')
      .populate('seatIds', 'seatNumber hall isBooked');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching bookings', error: err.message });
  }
});

module.exports = router;
