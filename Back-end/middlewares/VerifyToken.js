require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function verifyToken (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.json('The token is missing');
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('token');
          return res.status(401).json('Token expired');
        }
        return res.status(403).json('Invalid token');
      } else {
        req.user = decoded;
        next();
      }
    })
  }
};