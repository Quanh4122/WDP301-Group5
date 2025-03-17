module.exports = function verifyAdmin (req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json('Access denied. Admin only.');
  }
};