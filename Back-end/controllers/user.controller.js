require("dotenv").config();
const UserModel = require("../models/user.model");
const AuthModel = require("../models/auth.model");
const DriverApplicationModel = require("../models/driverapplication.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const mailService = require("../services/sendMail");
const otp = require("../Templates/Mail/otp");
const ResetPassword = require("../Templates/Mail/resetPassword");
const crypto = require("crypto");
const admin = require("../services/firebaseAdmin");
const RoleModel = require("../models/role.model");

const JWT_SECRET = process.env.JWT_SECRET;

const generateAndSendOTP = async (auth) => {
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  auth.otp = new_otp;
  auth.otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 mins expiry
  await auth.save({ new: true, validateModifiedOnly: true });

  const user = await UserModel.findById(auth.user);
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

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = await RoleModel.findOne({ roleName: "User" });
  const user = new UserModel({
    userName,
    phoneNumber,
    email,
    role: userRole._id,
  });
  await user.save();

  const auth = new AuthModel({ user: user._id, password: hashedPassword });
  await auth.save();

  await generateAndSendOTP(auth);

  return res.json({
    status: "success",
    message: "User registered successfully! OTP sent to email.",
    user_id: user._id,
  });
};

// [POST] /verify
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid",
    });
  }

  const auth = await AuthModel.findOne({
    user: user._id,
    otp,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!auth) {
    return res.status(400).json({
      status: "error",
      message: "OTP is invalid or expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  user.verified = true;
  auth.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });
  await auth.save({ new: true, validateModifiedOnly: true });

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

  const user = await UserModel.findOne({ email }).populate("role");
  if (!user) {
    return res.status(401).json({ message: "User not exist" });
  }

  if (!user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is not verified, Please verify.",
    });
  }

  const auth = await AuthModel.findOne({ user: user._id });
  if (!auth) {
    return res.status(500).json({ message: "Authentication data not found" });
  }

  const isMatch = await bcrypt.compare(password, auth.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.userName,
      role: user.role.roleName,
      phoneNumber: user.phoneNumber,
    },
    JWT_SECRET,
    { expiresIn: "10m" }
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
};

// [POST] LOGIN WITH GOOGLE
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      status: "error",
      message: "idToken is required",
    });
  }

  try {
    // Xác minh idToken với Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken, true); // Thêm checkRevoked: true để kiểm tra token bị thu hồi
    const { email, name, picture, uid } = decodedToken;

    // Kiểm tra user trong database
    let user = await UserModel.findOne({ email }).populate("role");
    let userRole = await RoleModel.findOne({ roleName: "User" });

    if (!userRole) {
      userRole = await new RoleModel({ roleName: "User" }).save();
    }

    if (!user) {
      // Nếu user chưa tồn tại, tạo mới
      user = new UserModel({
        userName: name || `User_${uid}`, // Đảm bảo có userName mặc định nếu name không tồn tại
        email,
        avatar: picture,
        verified: true, // Google login tự động verified
        role: userRole._id,
      });
      await user.save();

      const auth = new AuthModel({ user: user._id });
      await auth.save();
    }

    // Tạo JWT token cho phiên đăng nhập
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
        role: user.role.roleName, // Lấy roleName thay vì toàn bộ object role
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      status: "success",
      message: "Google login successful",
      user: {
        userId: user._id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName || "",
        avatar: user.avatar,
        role: user.role.roleName,
        token,
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    if (error.code === "auth/argument-error") {
      return res.status(400).json({
        status: "error",
        message: "Invalid Firebase ID token. Please try again.",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error logging in with Google: " + error.message,
    });
  }
};

// [GET] /logout
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.json("Success");
};

// [POST] /forgotPassword
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found." });
  }

  const auth = await AuthModel.findOne({ user: user._id });
  if (!auth) {
    return res.status(500).json({ message: "Authentication data not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  auth.passwordResetToken = hashedToken;
  auth.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  await auth.save();

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
    auth.passwordResetToken = undefined;
    auth.passwordResetExpires = undefined;
    await auth.save({ validateBeforeSave: false });

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
  const auth = await AuthModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!auth) {
    return res.status(400).json({
      status: "error",
      message: "Token is invalid or expired",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "error",
      message: "Passwords do not match",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  auth.password = hashedPassword;
  auth.passwordResetToken = undefined;
  auth.passwordResetExpires = undefined;
  await auth.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
};

// [PUT] /editProfile/:userId
const editProfile = async (req, res) => {
  try {
    const { userId } = req.params;

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

    const auth = await AuthModel.findOne({ user: userId });
    if (!auth) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, auth.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Mật khẩu hiện tại không chính xác!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    auth.password = hashedPassword;
    auth.passwordChangedAt = new Date();
    await auth.save();

    return res.status(200).json({ message: "Thay đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại!" });
  }
};

// [GET] /getUserById
const getUserById = async (req, res) => {
  try {
    const userId = req.query.key;
    const user = await UserModel.findById(userId).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau !!" });
  }
};

// [GET] Lấy danh sách user và driver (trừ admin)
const getUsersAndDrivers = async (req, res) => {
  try {
    const adminRole = await RoleModel.findOne({ roleName: "Admin" });
    if (!adminRole) {
      return res.status(500).json({ message: "Admin role not found" });
    }

    const users = await UserModel.find({
      role: { $ne: adminRole._id },
    })
      .populate("role")
      .select("-__v");

    return res.status(200).json({
      status: "success",
      message: "Users and drivers retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users and drivers:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};

// [POST] Đăng ký ứng tuyển driver
const applyForDriver = async (req, res) => {
  try {
    const { userId } = req.params;
    const { licenseNumber, experience } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!licenseNumber || !experience) {
      return res.status(400).json({
        status: "error",
        message: "License number và experience là bắt buộc",
      });
    }

    // Kiểm tra file upload
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng upload ảnh giấy phép lái xe",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy người dùng",
      });
    }

    const existingApplication = await DriverApplicationModel.findOne({
      user: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        status: "error",
        message: "Bạn đã nộp đơn ứng tuyển tài xế trước đó",
      });
    }

    // Tạo mới driver application với đường dẫn ảnh
    const driverApplication = new DriverApplicationModel({
      user: userId,
      status: "pending",
      appliedAt: new Date(),
      licenseNumber,
      experience: experience, // Giả định vehicleInfo là experience
      driversLicensePhoto: `/images/${req.file.filename}`, // Lưu đường dẫn ảnh
    });

    await driverApplication.save();

    return res.status(200).json({
      status: "success",
      message: "Đơn ứng tuyển tài xế đã được gửi thành công, đang chờ duyệt",
      data: {
        userId: user._id,
        driverApplication,
      },
    });
  } catch (error) {
    console.error("Error applying for driver:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server, vui lòng thử lại sau",
    });
  }
};

// [PUT] Duyệt hoặc từ chối ứng tuyển driver (dành cho admin)
const approveDriverApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Status must be either 'approved' or 'rejected'",
      });
    }

    const driverApplication = await DriverApplicationModel.findOne({
      user: userId,
    });
    if (!driverApplication || driverApplication.status !== "pending") {
      return res.status(400).json({
        status: "error",
        message: "No pending driver application found",
      });
    }

    driverApplication.status = status;
    if (status === "approved") {
      driverApplication.approvedAt = new Date();
      const user = await UserModel.findById(userId);
      let driverRole = await RoleModel.findOne({ roleName: "Driver" });
      if (!driverRole) {
        driverRole = await new RoleModel({ roleName: "Driver" }).save();
      }
      user.role = driverRole._id;
      await user.save();
    }

    await driverApplication.save();

    return res.status(200).json({
      status: "success",
      message: `Driver application ${status} successfully`,
      data: {
        userId,
        driverApplication,
      },
    });
  } catch (error) {
    console.error("Error approving driver application:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};

// [GET] Lấy danh sách ứng tuyển driver đang chờ duyệt (dành cho admin)
const getPendingDriverApplications = async (req, res) => {
  try {
    const pendingApplications = await DriverApplicationModel.find({
      status: "pending",
    }).populate({
      path: "user",
      select: "userName email phoneNumber",
    });

    return res.status(200).json({
      status: "success",
      message: "Pending driver applications retrieved successfully",
      data: pendingApplications,
    });
  } catch (error) {
    console.error("Error fetching pending driver applications:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
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
  applyForDriver,
  approveDriverApplication,
  getPendingDriverApplications,
  getUsersAndDrivers,
};
