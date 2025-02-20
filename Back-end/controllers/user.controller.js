require('dotenv').config();
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;


const register = async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;
  console.log(req.body);
  await bcrypt.hash(password, 10)
    .then(hash => {
      UserModel.create({ userName, phoneNumber, email, password: hash })
        .then(user => {
          console.log(user);
          return res.json({
            _id: user._id,
            email: user.email,
            userName: user.userName,
            password: user.password,
            phoneNumber: user.phoneNumber,
            role: user.role
          });
        })
        .catch(err => {
          console.log(err);
          res.json(err)
        })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ error: 'Failed to register' })
    });
}

// [POST] /login
const login = async (req, res) => {
  const { email, password } = req.body;
  await UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({
              _id: user._id,
              email: user.email,
              username: user.userName,
              role: user.role,
              fullname: user.fullName,
              phoneNumber: user.phoneNumber
            }, JWT_SECRET, { expiresIn: '1h' })
            res.cookie('token', token, {
              httpOnly: true,
              sameSite: 'strict'
            });
            res.json({ Status: 'Success', role: user.role, token: token });
          } else {
            return res.status(401).json({ message: 'Password is incorrect' });
            ;
          }
        });
      } else {
        return res.status(401).json({ message: 'User not exist' });
      };
    });
};

 // [GET] /logout
const logout = async(req, res) => {
  res.clearCookie('token');
  return res.json('Success');
};


module.exports = {
  register,
  login,
  logout
};
