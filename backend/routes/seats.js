const router = require('express').Router();
const Seat = require('../models/Seat');

// ✅ Route to get seats by showtime
router.get('/showtime/:id', async (req, res) => {
  try {
    const seats = await Seat.find({ showtime: req.params.id });
    res.json(seats);
  } catch (err) {
    console.error('❌ Error fetching seats:', err);
    res.status(500).json({ msg: 'Error fetching seats' });
  }
});

module.exports = router;
