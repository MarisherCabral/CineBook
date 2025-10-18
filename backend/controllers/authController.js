const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = "your_jwt_secret"; // use .env in production

exports.signup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role }, SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
