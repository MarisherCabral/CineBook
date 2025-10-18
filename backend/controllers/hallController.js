const CinemaHall = require('../models/CinemaHall');

exports.getHalls = async (req, res) => {
  const halls = await CinemaHall.find();
  res.json(halls);
};

exports.addHall = async (req, res) => {
  const hall = new CinemaHall(req.body);
  await hall.save();
  res.json(hall);
};

exports.updateHall = async (req, res) => {
  const { id } = req.params;
  const updated = await CinemaHall.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.deleteHall = async (req, res) => {
  const { id } = req.params;
  await CinemaHall.findByIdAndDelete(id);
  res.json({ msg: 'Hall deleted' });
};
