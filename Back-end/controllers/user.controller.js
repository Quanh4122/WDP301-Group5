const { db } = require("../models");

const user = db.user;

const getAllUser = async (req, res) => {
  try {
    const result = await user.find(); // Dùng await thay vì then/catch
    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  getAllUser,
};
