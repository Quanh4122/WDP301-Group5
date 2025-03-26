require('dotenv').config();
const PostModel = require('../models/blog.model');

const createPost = async (req, res) => {
  try {
    const { title, content, image, dateCreate, description } = req.body;

    // Check if all required fields are provided
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Check if a post with the same title already exists
    const existingPost = await PostModel.findOne({ title });
    if (existingPost) {
      return res.status(400).json({ message: "A post with this title already exists" });
    }

    // Create a new post
    const newPost = new PostModel({ title, description, image, dateCreate, content });

    // Save to the database
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if postId is valid
    if (!postId || postId === "undefined") {
      return res.status(400).json({ message: "Invalid or missing Post ID" });
    }

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await PostModel.find();

    // Check if there are no posts
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid or missing Post ID" });
    }

    const deletedBlog = await PostModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const { title, content, image, dateCreate, description } = req.body; // Lấy dữ liệu mới từ body

    // Check if id is provided and valid
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid or missing Post ID" });
    }

    // Check if at least one field is provided to update
    if (!title && !content && !image && !dateCreate && !description) {
      return res.status(400).json({ message: "At least one field must be provided to update" });
    }

    // Find the existing post
    const existingPost = await PostModel.findById(id); // Sửa từ postId thành id
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check title conflict
    if (title && title !== existingPost.title) {
      const titleConflict = await PostModel.findOne({ title });
      if (titleConflict) {
        return res.status(400).json({ message: "A post with this title already exists" });
      }
    }

    // Prepare the update object with only provided fields
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (image) updateData.image = image;
    if (dateCreate) updateData.dateCreate = dateCreate;
    if (description) updateData.description = description;

    // Update the post
    const updatedPost = await PostModel.findByIdAndUpdate(
      id, // Sửa từ postId thành id
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createPost, getPost, getAllPosts, deleteBlog, updatePost };