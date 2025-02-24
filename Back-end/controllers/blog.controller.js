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

  const getPost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      // Check if postId is valid
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
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
  
  module.exports = { createPost, getPost, getAllPosts };