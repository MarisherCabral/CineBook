// seatController.js
const Seat = require('../models/Seat');

exports.getSeats = async (req, res) => {
  const seats = await Seat.find();
  res.json(seats);
};

exports.getSeatsByShowtime = async (req, res) => {
  const { id } = req.params;
  try {
    const seats = await Seat.find({ showtime: id });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching seats for showtime', error: err });
  }
};

exports.addSeat = async (req, res) => {
  const seat = new Seat(req.body);
  await seat.save();
  res.json(seat);
};

exports.updateSeat = async (req, res) => {
  const { id } = req.params;
  const updated = await Seat.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.deleteSeat = async (req, res) => {
  const { id } = req.params;
  await Seat.findByIdAndDelete(id);
  res.json({ msg: 'Seat deleted' });
};
