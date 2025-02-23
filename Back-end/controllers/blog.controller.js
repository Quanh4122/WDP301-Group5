require('dotenv').config();
const PostModel = require('../models/blog.model')

const createPost = async (req, res) => {
    try {
      const { title, content, author, image, dateCreate, description } = req.body;
  
      // Check if all required fields are provided
      if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content, and author are required" });
      }
  
      // Check if a post with the same title already exists
      const existingPost = await PostModel.findOne({ title });
      if (existingPost) {
        return res.status(400).json({ message: "A post with this title already exists" });
      }
  
      // Create a new post
      const newPost = new PostModel({title, description, image, author, dateCreate, content});
  
      // Save to the database
      await newPost.save();
  
      res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  module.exports = { createPost };