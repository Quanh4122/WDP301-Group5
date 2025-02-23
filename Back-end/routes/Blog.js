const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog.controller');

router.post('/postBlog', blogController.createPost);


module.exports = router;
