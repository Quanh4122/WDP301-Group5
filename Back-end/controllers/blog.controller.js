require("dotenv").config();
const PostModel = require("../models/blog.model");
const multer = require("multer");
const uploadSingle = require("../middlewares/Upload"); // Import cấu hình gốc (dành cho upload một file)

// Tạo instance mới để hỗ trợ nhiều file dựa trên cấu hình gốc
const uploadMultiple = multer({
  storage: uploadSingle.storage,
  limits: uploadSingle.limits,
  fileFilter: uploadSingle.fileFilter,
}).array("images", 10); // Hỗ trợ tối đa 10 ảnh

const createPost = async (req, res) => {
  // Sử dụng uploadMultiple thay vì uploadSingle
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const { title, dateCreate, description } = req.body;
      const images = req.files
        ? req.files.map((file) => `/images/${file.filename}`)
        : [];

      if (!title) {
        return res.status(400).json({ message: "Tiêu đề là bắt buộc" });
      }

      const existingPost = await PostModel.findOne({ title });
      if (existingPost) {
        return res.status(400).json({ message: "Bài viết với tiêu đề này đã tồn tại" });
      }

      const newPost = new PostModel({
        title,
        description,
        images, // Mảng đường dẫn ảnh
        dateCreate: dateCreate || new Date(),
      });

      await newPost.save();
      res.status(201).json({ message: "Tạo bài viết thành công", post: newPost });
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  });
};

const updatePost = async (req, res) => {
  // Sử dụng uploadMultiple thay vì uploadSingle
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const { id } = req.params;
      const { title, dateCreate, description, existingImages } = req.body;

      const newImages = req.files
        ? req.files.map((file) => `/images/${file.filename}`)
        : [];
      const oldImages = existingImages ? JSON.parse(existingImages) : [];
      const images = [...oldImages, ...newImages];

      if (!id || id === "undefined") {
        return res.status(400).json({ message: "ID bài viết không hợp lệ hoặc thiếu" });
      }

      const existingPost = await PostModel.findById(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Không tìm thấy bài viết" });
      }

      if (title && title !== existingPost.title) {
        const titleConflict = await PostModel.findOne({ title });
        if (titleConflict) {
          return res.status(400).json({ message: "Đã tồn tại bài viết với tiêu đề này" });
        }
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (images.length > 0) updateData.images = images;
      if (dateCreate) updateData.dateCreate = dateCreate;
      if (description) updateData.description = description;
      updateData.dateUpdated = new Date();

      const updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({ message: "Cập nhật bài viết thành công", post: updatedPost });
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  });
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId || postId === "undefined") {
      return res.status(400).json({ message: "ID bài viết không hợp lệ hoặc thiếu" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    if (!posts.length) {
      return res.status(404).json({ message: "Không tìm thấy bài viết nào" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "ID bài viết không hợp lệ hoặc thiếu" });
    }
    const deletedBlog = await PostModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    return res.status(200).json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

module.exports = { createPost, getPost, getAllPosts, deleteBlog, updatePost };