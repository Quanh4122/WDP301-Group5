require('dotenv').config();
const PostModel = require('../models/blog.model');

const createPost = async (req, res) => {
  try {
    const { title, content, dateCreate, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null; // Lấy đường dẫn ảnh từ multer

    // Kiểm tra các trường bắt buộc
    if (!title || !content) {
      return res.status(400).json({ message: "Tiêu đề và nội dung là bắt buộc" });
    }

    // Kiểm tra xem bài viết với tiêu đề này đã tồn tại chưa
    const existingPost = await PostModel.findOne({ title });
    if (existingPost) {
      return res.status(400).json({ message: "Bài viết với tiêu đề này đã tồn tại" });
    }

    // Tạo bài viết mới
    const newPost = new PostModel({
      title,
      description,
      image, // Đường dẫn ảnh từ upload
      dateCreate: dateCreate || new Date(), // Nếu không cung cấp, dùng thời gian hiện tại
      content,
    });

    // Lưu vào cơ sở dữ liệu
    await newPost.save();

    res.status(201).json({ message: "Tạo bài viết thành công", post: newPost });
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Kiểm tra ID hợp lệ
    if (!postId || postId === "undefined") {
      return res.status(400).json({ message: "ID bài viết không hợp lệ hoặc thiếu" });
    }

    // Tìm bài viết theo ID
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
    // Lấy tất cả bài viết từ cơ sở dữ liệu
    const posts = await PostModel.find();

    // Kiểm tra xem có bài viết nào không
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

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, dateCreate, description } = req.body;

    // Debug để kiểm tra dữ liệu gửi lên
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    // Xử lý ảnh: ưu tiên ảnh mới từ req.file, nếu không thì giữ ảnh cũ từ body
    const image = req.file ? `/images/${req.file.filename}` : req.body.image;

    // Kiểm tra ID hợp lệ
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "ID bài viết không hợp lệ hoặc thiếu" });
    }

    // Tìm bài viết hiện có
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Kiểm tra xung đột tiêu đề (nếu thay đổi tiêu đề)
    if (title && title !== existingPost.title) {
      const titleConflict = await PostModel.findOne({ title });
      if (titleConflict) {
        return res.status(400).json({ message: "Đã tồn tại bài viết với tiêu đề này" });
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (image) updateData.image = image; // Ảnh mới hoặc ảnh cũ
    if (dateCreate) updateData.dateCreate = dateCreate;
    if (description) updateData.description = description;
    updateData.dateUpdated = new Date();

    // Cập nhật bài viết
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
};

module.exports = { createPost, getPost, getAllPosts, deleteBlog, updatePost };