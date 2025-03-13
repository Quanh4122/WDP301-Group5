require("dotenv").config();
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const mailService = require("../services/sendMail");
const otp = require("../Templates/Mail/otp");
const ResetPassword = require("../Templates/Mail/resetPassword");
const crypto = require("crypto");
const admin = require("../services/firebaseAdmin");
const { log } = require("console");
const RoleModel = require("../models/role.model");

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
    text: "Hello",
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
  const user =
    existing_user ||
    new UserModel({ userName, phoneNumber, email, password: hashedPassword });

  if (!existing_user) {
    await user.save();
  }

  await generateAndSendOTP(user);

  return res.json({
    status: "success",
    message: "User registered successfully! OTP sent to email.",
    user_id: user._id,
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
  const user = await UserModel.findOne({
    email,
    otp,
    otp_expiry_time: { $gt: Date.now() },
  });

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
    return res
      .status(400)
      .json({ status: "error", message: "OTP is incorrect" });
  }

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });

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
  }
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  await UserModel.findOne({ email: email })
    .populate("role")
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign(
              {
                _id: user._id,
                email: user.email,
                username: user.userName,
                role: user.role,
                phoneNumber: user.phoneNumber,
              },
              JWT_SECRET,
              { expiresIn: "1m" }
            );
            res.cookie("token", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.json({
              Status: "Success",
              userId: user._id,
              userName: user.userName,
              fullName: user.fullName,
              phoneNumber: user.phoneNumber,
              avatar: user.avatar,
              address: user.address,
              role: user.role.roleName,
              token: token,
            });
          } else {
            return res.status(401).json({ message: "Password is incorrect" });
          }
        });
      } else {
        return res.status(401).json({ message: "User not exist" });
      }
    });
};

// [POST] LOGIN WITH GOOGLE
const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  console.log("🔥 idToken:", idToken);

  if (!idToken) {
    return res.status(400).json({
      status: "error",
      message: "idToken is required",
    });
  }

  try {
    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user already exists in the database
    let user = await UserModel.findOne({ email: email });

    let userRole = await RoleModel.findOne({ roleName: 'user' });
    if (!userRole) {
      userRole = await new RoleModel({ roleName: 'user' }).save();
    }

    if (!user) {
      // If the user does not exist, create a new one
      user = new UserModel({
        userName: name,
        email: email,
        avatar: picture,
        verified: true, 
        role: userRole._id,
      });

      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1m" }
    );

    // Respond with user details and the JWT token
    res.status(200).json({
      status: "success",
      message: "Google login successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      status: "error",
      message: "Error logging in with Google",
    });
  }
};


// [GET] /logout
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.json("Success");
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found." });
  }

  // Tạo token đặt lại mật khẩu
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  try {
    const resetURL = `http://localhost:3000/app/reset-password?token=${resetToken}`;
    const emailContent = await ResetPassword(`${user.userName}`, resetURL);

    await mailService.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email.",
    });
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
    return res
      .status(400)
      .json({ status: "error", message: "Token is missing" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "Token is invalid or expired" });
  }

  if (password !== passwordConfirm) {
    return res
      .status(400)
      .json({ status: "error", message: "Passwords do not match" });
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

// [PUT] /editProfile/:userId
const editProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔥 userId nhận được:", userId);
    console.log("🔥 req.params:", req.params);

    console.log("🔥 Dữ liệu nhận được từ body:", req.body);
    console.log("🔥 File nhận được:", req.file);

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId!" });
    }

    let updateData = {
      userName: req.body.userName,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    };

    if (req.file) {
      updateData.avatar = `/images/${req.file.filename}`;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    res.status(200).json({
      message: "Cập nhật thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("🔥 Lỗi cập nhật hồ sơ:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// [PUT] /changePassword/:userId
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { userId } = req.params;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới và xác nhận không khớp!" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Mật khẩu hiện tại không chính xác!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Thay đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại!" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.query.key;
    const user = await UserModel.findById(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau !!" });
  }
};

module.exports = {
  register,
  verifyOTP,
  forgotPassword,
  resetPassword,
  login,
  logout,
  editProfile,
  changePassword,
  getUserById,
  googleLogin,
};
