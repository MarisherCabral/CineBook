const router = require('express').Router();
const { auth } = require('../middleware/authMiddleware');
const { addPayment, getPayments } = require('../controllers/paymentController');

router.get('/', auth, getPayments);          // Get payments for user
router.post('/', auth, addPayment);          // Add payment

module.exports = router;
