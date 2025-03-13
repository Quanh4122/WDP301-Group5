module.exports = function verifyAdmin (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json('Access denied. Driver only.');
  }
};