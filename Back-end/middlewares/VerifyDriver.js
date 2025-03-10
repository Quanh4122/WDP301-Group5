module.exports = function verifyAdmin (req, res, next) {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    return res.status(403).json('Access denied. Driver only.');
  }
};