const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const movieController = require('../controllers/movieController');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Movie routes
router.get('/', movieController.getMovies);
router.post('/', upload.single('photo'), movieController.addMovie);

router.delete('/:id', movieController.deleteMovie);

module.exports = router;
