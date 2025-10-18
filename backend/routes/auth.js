const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Admin routes
router.post('/admin/signup', authController.signup);
router.post('/admin/login', authController.login);

// User routes
router.post('/user/signup', authController.signup);
router.post('/user/login', authController.login);

module.exports = router;
