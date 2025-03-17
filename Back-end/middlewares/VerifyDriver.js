module.exports = function verifyDriver (req, res, next) {
  if (req.user && req.user.role === 'Driver') {
    next();
  } else {
    return res.status(403).json('Access denied. Driver only.');
  }
};