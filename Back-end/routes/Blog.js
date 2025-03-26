const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog.controller');

router.post('/postBlog', blogController.createPost);
router.get('/blog/:postId', blogController.getPost);
router.get('/blog', blogController.getAllPosts);
router.delete('/blog/:id', blogController.deleteBlog);
router.put('/putBlog/:id', blogController.updatePost);



module.exports = router;
