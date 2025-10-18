const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Customer'], required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

module.exports = mongoose.model('User', userSchema);
