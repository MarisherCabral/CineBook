const jwt = require('jsonwebtoken');
const SECRET = "your_jwt_secret";

exports.auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: "Admin only" });
  next();
};
