require('dotenv').config();
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require("otp-generator");
const mailService = require('../services/sendMail');
const otp = require("../Templates/Mail/otp");
const ResetPassword = require("../Templates/Mail/resetPassword");
const crypto = require("crypto");




const JWT_SECRET = process.env.JWT_SECRET;

const generateAndSendOTP = async (user) => {
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  user.otp = new_otp;
  user.otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 mins expiry
  await user.save({ new: true, validateModifiedOnly: true });


  await mailService.sendEmail({
    to: user.email,
    subject: "Verification OTP",
    text: 'Hello',
    html: otp(`${user.userName}`, new_otp),
  });
};


// [POST] /register
const register = async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;
  const existing_user = await UserModel.findOne({ email: email });

  if (existing_user) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = existing_user || new UserModel({ userName, phoneNumber, email, password: hashedPassword });

  if (!existing_user) {
    await user.save();
  }

  await generateAndSendOTP(user);

  return res.json({
    status: "success",
    message: "User registered successfully! OTP sent to email.",
    user_id: user._id
  });
};

// [POST] /sendOtp
// const sendOTP = async (req, res) => {
//   const { userId } = req;
//   const user = await UserModel.findById(userId);
//   if (!user) {
//     return res.status(404).json({ status: "error", message: "User not found." });
//   }
//   await generateAndSendOTP(user);
//   res.status(200).json({ status: "success", message: "OTP Sent Successfully!" });
// };


// [POST] /verify
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserModel.findOne({ email, otp, otp_expiry_time: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ status: "error", message: "OTP is incorrect" });
  }

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
  });
};


// [POST] /login
const login = async (req, res) => {
  const { email, password } = req.body;
  const existing_user = await UserModel.findOne({ email: email });
  if (existing_user && !existing_user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is not verify, Please verify.",
    });
  };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  };

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
const logout = async (req, res) => {
  res.clearCookie('token');
  return res.json('Success');
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found." });
  }

  // Tạo token đặt lại mật khẩu
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  try {
    const resetURL = `http://localhost:3000/app/reset-password?token=${resetToken}`;
    const emailContent = await ResetPassword(`${user.userName}`, resetURL);

    await mailService.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent
    });

    res.status(200).json({ status: "success", message: "Password reset link sent to email." });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
};

// [POST] /resetPassword
const resetPassword = async (req, res) => {
  const { token, password, passwordConfirm } = req.body;

  if (!token) {
    return res.status(400).json({ status: "error", message: "Token is missing" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, 
  });

  if (!user) {
    return res.status(400).json({ status: "error", message: "Token is invalid or expired" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ status: "error", message: "Passwords do not match" });
  }

  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  // Xóa token sau khi đổi mật khẩu thành công
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
};



module.exports = {
  register,
  verifyOTP,
  forgotPassword,
  resetPassword,
  login,
  logout
};
