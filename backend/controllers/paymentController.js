const Payment = require('../models/Payment');

exports.getPayments = async (req, res) => {
  const payments = await Payment.find({ customerId: req.user.id });
  res.json(payments);
};

exports.addPayment = async (req, res) => {
  const payment = new Payment({ ...req.body, customerId: req.user.id });
  await payment.save();
  res.json(payment);
};
