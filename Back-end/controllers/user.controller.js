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
const validator = require('validator');


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
  try {
    const { userName, phoneNumber, email, password } = req.body;

    // Kiểm tra xem tất cả các trường có được gửi lên hay không
    if (!userName && !phoneNumber && !email && !password) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng nhập đầy đủ thông tin (tên, số điện thoại, email, mật khẩu)!",
      });
    }

    // Kiểm tra userName
    if (typeof userName !== "string" || userName.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Tên người dùng không được để trống!",
      });
    }
    if (userName.length < 3 || userName.length > 12) {
      return res.status(400).json({
        status: "error",
        message: "Tên người dùng phải trong khoảng từ 3 đến 12 ký tự!",
      });
    }
    const userNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!userNameRegex.test(userName)) {
      return res.status(400).json({
        status: "error",
        message: "Tên người dùng chỉ được chứa chữ cái, số, dấu chấm, gạch dưới hoặc gạch ngang!",
      });
    }

    // Kiểm tra phoneNumber
    if (typeof phoneNumber !== "string" || phoneNumber.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Số điện thoại không được để trống!",
      });
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        status: "error",
        message: "Số điện thoại phải là 10 chữ số và chỉ chứa số!",
      });
    }

    // Kiểm tra email
    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Email không được để trống!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",  
        message: "Email không đúng định dạng!",
      });
    }

    // Kiểm tra password
    if (typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu không được để trống!",
      });
    }
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu phải trong khoảng từ 6 đến 20 ký tự!",
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (!existingUser.verified) {
        // Trường hợp đã đăng ký nhưng chưa xác thực
        const auth = await AuthModel.findOne({ user: existingUser._id });
        if (!auth) {
          return res.status(500).json({
            status: "error",
            message: "Không tìm thấy thông tin xác thực cho người dùng này!",
          });
        }

        // Kiểm tra số điện thoại mới có trùng với người dùng khác không
        const existingPhone = await UserModel.findOne({ phoneNumber, _id: { $ne: existingUser._id } });
        if (existingPhone) {
          return res.status(400).json({
            status: "error",
            message: "Số điện thoại này đã được sử dụng bởi người dùng khác!",
          });
        }

        // Cập nhật thông tin mới
        existingUser.userName = userName;
        existingUser.phoneNumber = phoneNumber;
        await existingUser.save();

        // Hash lại mật khẩu mới (nếu thay đổi)
        const hashedPassword = await bcrypt.hash(password, 10);
        auth.password = hashedPassword;
        await auth.save();

        // Gửi lại OTP
        await generateAndSendOTP(auth);

        return res.status(200).json({
          status: "success",
          message: "Tài khoản của bạn từng đăng ký nhưng chưa xác thực. Mã OTP mới đã được gửi đến email của bạn!",
          user_id: existingUser._id,
        });
      }
      // Trường hợp đã xác thực
      return res.status(400).json({
        status: "error",
        message: "Email này đã được sử dụng. Vui lòng đăng nhập!",
      });
    }

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existingPhone = await UserModel.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        status: "error",
        message: "Số điện thoại này đã được sử dụng!",
      });
    }

    // Hash mật khẩu và tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await RoleModel.findOne({ roleName: "User" });
    if (!userRole) {
      return res.status(500).json({
        status: "error",
        message: "Không tìm thấy vai trò người dùng trong hệ thống!",
      });
    }

    const user = new UserModel({
      userName,
      phoneNumber,
      email,
      role: userRole._id,
      verified: false,
    });
    await user.save();

    const auth = new AuthModel({ user: user._id, password: hashedPassword });
    await auth.save();

    await generateAndSendOTP(auth);

    return res.status(200).json({
      status: "success",
      message: "Đăng ký thành công! Mã OTP đã được gửi đến email của bạn.",
      user_id: user._id,
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau!",
    });
  }
};



// [POST] /verify
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email không hợp lệ!",
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
        message: "Mã OTP không hợp lệ hoặc đã hết hạn!",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Email đã được xác thực trước đó!",
      });
    }

    user.verified = true;
    auth.otp = undefined;
    await user.save({ new: true, validateModifiedOnly: true });
    await auth.save({ new: true, validateModifiedOnly: true });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      status: "success",
      message: "Xác thực OTP thành công!",
      token,
      user_id: user._id,
    });
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại!",
    });
  }
};

// New Resend OTP endpoint
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng cung cấp email!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email không tồn tại!",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Email đã được xác thực!",
      });
    }

    // Tìm auth record tương ứng
    const auth = await AuthModel.findOne({ user: user._id });
    if (!auth) {
      return res.status(400).json({
        status: "error",
        message: "Không tìm thấy thông tin xác thực cho người dùng này!",
      });
    }

    // Tạo OTP mới
    const newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const otpExpiryTime = Date.now() + 10 * 60 * 1000; // 10 phút hết hạn

    // Cập nhật OTP và thời gian hết hạn
    auth.otp = newOtp;
    auth.otp_expiry_time = otpExpiryTime;
    await auth.save({ new: true, validateModifiedOnly: true });

    // Gửi email chứa OTP
    await mailService.sendEmail({
      to: user.email,
      subject: "Mã OTP mới",
      text: "Hello",
      html: otp(`${user.userName}`, newOtp), // Sử dụng template OTP
    });

    res.status(200).json({
      status: "success",
      message: "Đã gửi lại mã OTP mới đến email của bạn!",
    });
  } catch (error) {
    console.error("Lỗi gửi lại OTP:", error);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi gửi lại OTP. Vui lòng thử lại!",
    });
  }
};


// [POST] /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" && password === "") {
      return res.status(400).json({ message: "Email và mật khẩu không được để trống" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email phải bắt buộc được điền" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email không đúng định dạng" });
    }

    if (!password) {
      return res.status(400).json({ message: "Mật khẩu phải bắt buộc được điền" });
    }

    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ message: "Mật khẩu phải trong khoảng từ 6 đến 20 ký tự" });
    }

    const user = await UserModel.findOne({ email }).populate("role");
    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại trong hệ thống" });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Email chưa được xác minh, vui lòng xác minh email"
      });
    }

    const auth = await AuthModel.findOne({ user: user._id });
    if (!auth) {
      return res.status(500).json({
        message: "Tài khoản của bạn chưa tồn tại. Vui lòng tạo tài khoản mới hoặc sử dụng dịch vụ google"
      });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      // Increment login attempts
      await AuthModel.updateOne({ user: user._id }, { $inc: { loginAttempts: 1 } });
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    // Reset login attempts on successful login
    await AuthModel.updateOne({ user: user._id }, { loginAttempts: 0 });

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.userName,
        role: user.role.roleName,
        phoneNumber: user.phoneNumber,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production' // Add secure flag in production
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: {
        status: "Success",
        userId: user._id,
        userName: user.userName,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        address: user.address,
        role: user.role.roleName,
        token: token,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
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
      { expiresIn: "1h" }
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
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email không đúng định dạng" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email bạn nhập không tồn tại",
      });
    };

    if (!user.verified) {  
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
      user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; 
      await user.save();

      // Gửi email verification
      const verifyURL = `http://localhost:3000/app/verify?token=${verificationToken}`;
      const verifyEmailContent = await VerifyEmailTemplate(`${user.userName}`, verifyURL);

      await mailService.sendEmail({
        to: user.email,
        subject: "Account Verification Required",
        html: verifyEmailContent,
      });

      return res.status(403).json({
        status: "error",
        message: "Account not verified. Please verify your email first. A verification link has been sent.",
      });
    };

    const auth = await AuthModel.findOne({ user: user._id });
    if (!auth) {
      return res.status(500).json({
        status: "error",
        message: "Authentication data not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    auth.passwordResetToken = hashedToken;
    auth.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await auth.save();

    const resetURL = `http://localhost:3000/app/reset-password?token=${resetToken}`;
    const emailContent = await ResetPassword(`${user.userName}`, resetURL);

    await mailService.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    return res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
    });
  } catch (err) {
    if (auth) {
      auth.passwordResetToken = undefined;
      auth.passwordResetExpires = undefined;
      await auth.save({ validateBeforeSave: false });
    }

    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password, passwordConfirm } = req.body;

    // Validate inputs
    if (!password && !passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng nhập đầy đủ mật khẩu và mật khẩu xác nhận!",
      });
    }

    // Validate token
    if (typeof token !== "string" || !token.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Token không được để trống!",
      });
    }

    // Validate password
    if (typeof password !== "string" || !password.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu mới không được để trống!",
      });
    }

    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu phải trong khoảng từ 6 đến 20 ký tự!",
      });
    }

    if (typeof passwordConfirm !== "string" || !passwordConfirm.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu xác nhận không được để trống!",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu mới và xác nhận không khớp!",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const auth = await AuthModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!auth) {
      return res.status(400).json({
        status: "error",
        message: "Token không hợp lệ hoặc đã hết hạn!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    auth.password = hashedPassword;
    auth.passwordResetToken = undefined;
    auth.passwordResetExpires = undefined;
    await auth.save();

    return res.status(200).json({
      status: "success",
      message: "Đặt lại mật khẩu thành công!",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ, vui lòng thử lại!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
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

    if (!currentPassword && !newPassword && !confirmPassword) {
      return res
        .status(400)
        .json({ 
          status: "error",
          message: "Vui lòng nhập đầy đủ thông tin!" 
        });
    }

    if (currentPassword === '' || !currentPassword) {
      return res
        .status(400)
        .json({           
          status: "error",
          message: "Mật khẩu hiện tại không được để trống!" });
    };

    if (newPassword === '' || !newPassword) {
      return res
        .status(400)
        .json({ 
          status: "error",
          message: "Mật khẩu mới không được để trống!" });
    };

    if (confirmPassword === '' || !confirmPassword) {
      return res
        .status(400)
        .json({ 
          status: "error",
          message: "Mật khẩu xác nhận không được để trống!" });
    }

    if (newPassword.length < 6 || newPassword.length > 20 ) {
      return res
        .status(400)
        .json({ 
          status: "error",
          message: "Mật khẩu phải trong khoảng từ 6 đến 20 ký tự!" });
    }
    
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ 
          status: "error",
          message: "Mật khẩu mới và xác nhận không khớp!" });
    }

    const auth = await AuthModel.findOne({ user: userId });
    if (!auth) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, auth.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ 
          status: "error",
          message: "Mật khẩu hiện tại không chính xác!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    auth.password = hashedPassword;
    auth.passwordChangedAt = new Date();
    await auth.save();
    res.clearCookie('token');

    return res.status(200).json({ 
      status: "success",
      message: "Thay đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({ 
      status: "error",
      message: "Lỗi máy chủ, vui lòng thử lại!" });
  }
};

// [GET] /getUserById
const getUserById = async (req, res) => {
  try {
    const userId = req.query.key;
    console.log("Fetching user with ID:", userId);
    const user = await UserModel.findById(userId)
      .select("userName fullName email phoneNumber address avatar role")
      .populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User Data:", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error.message, error.stack);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau !!", error: error.message });
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

    console.log("Users fetched:", users); // Log để kiểm tra dữ liệu

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
      select: "userName email phoneNumber role", // Lấy cả trường role
      populate: {
        path: "role", // Populate trường role từ model Role
        select: "roleName", // Chỉ lấy roleName từ model Role
      },
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


const getApprovedDriverApplications = async (req, res) => {
  try {
    const approvedApplications = await DriverApplicationModel.find({
      status: "approved",
    }).populate({
      path: "user",
      select: "userName email phoneNumber role", // Lấy cả trường role
      populate: {
        path: "role", // Populate trường role từ model Role
        select: "roleName", // Chỉ lấy roleName từ model Role
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Approved driver applications retrieved successfully",
      data: approvedApplications,
    });
  } catch (error) {
    console.error("Error fetching approved driver applications:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};

const getRejectedDriverApplications = async (req, res) => {
  try {
    const rejectedApplications = await DriverApplicationModel.find({
      status: "rejected",
    }).populate({
      path: "user",
      select: "userName email phoneNumber role", // Lấy cả trường role
      populate: {
        path: "role", // Populate trường role từ model Role
        select: "roleName", // Chỉ lấy roleName từ model Role
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Rejected driver applications retrieved successfully",
      data: rejectedApplications,
    });
  } catch (error) {
    console.error("Error fetching rejected driver applications:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params
    const { roleName } = req.body; // Lấy roleName từ body (User, Driver, Admin)

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !roleName) {
      return res.status(400).json({
        status: "error",
        message: "User ID và Role Name là bắt buộc",
      });
    }

    // Kiểm tra vai trò hợp lệ
    const validRoles = ["User", "Driver"];
    if (!validRoles.includes(roleName)) {
      return res.status(400).json({
        status: "error",
        message: "Vai trò không hợp lệ. Chỉ chấp nhận: User, Driver, Admin",
      });
    }

    // Tìm user cần cập nhật
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy người dùng",
      });
    }

    // Tìm hoặc tạo role mới
    let newRole = await RoleModel.findOne({ roleName });
    if (!newRole) {
      newRole = await new RoleModel({ roleName }).save();
    }

    // Kiểm tra nếu user đã có vai trò này
    if (user.role.toString() === newRole._id.toString()) {
      return res.status(400).json({
        status: "error",
        message: `Người dùng đã có vai trò ${roleName}`,
      });
    }

    // Cập nhật vai trò cho user
    user.role = newRole._id;
    await user.save();

    // Lấy thông tin user sau khi cập nhật
    const updatedUser = await UserModel.findById(userId).populate("role");

    return res.status(200).json({
      status: "success",
      message: `Đã cập nhật vai trò thành ${roleName} thành công`,
      data: {
        userId: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role.roleName,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
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
  getApprovedDriverApplications,
  getRejectedDriverApplications,
  getUsersAndDrivers,
  updateUserRole,
};
