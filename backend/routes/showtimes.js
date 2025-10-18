const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/authMiddleware');
const {
  getShowTimes,
  addShowTime,
  deleteShowTime
} = require('../controllers/showtimeController');
const ShowTime = require('../models/ShowTime');

// Public route: get all showtimes
router.get('/', getShowTimes);

// ✅ New route: get showtimes by movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const showtimes = await ShowTime.find({ movie: req.params.movieId }).sort({ startTime: 1 });
    res.json(showtimes);
  } catch (err) {
    console.error('Error fetching showtimes for movie:', err);
    res.status(500).json({ msg: 'Error fetching showtimes for movie', error: err.message });
  }
});

// Admin routes
router.post('/', auth, adminOnly, addShowTime);
router.delete('/:id', auth, adminOnly, deleteShowTime);

module.exports = router;
