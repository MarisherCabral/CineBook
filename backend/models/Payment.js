const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  paymentMethod: String,
  paymentDate: { type: Date, default: Date.now },
  transactionCode: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
