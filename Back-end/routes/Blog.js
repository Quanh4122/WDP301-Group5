const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog.controller');
const verifyToken = require('../middlewares/VerifyToken');
const verifyAdmin = require('../middlewares/VerifyAdmin');
const upload = require("../middlewares/Upload");


router.post('/postBlog', verifyToken, verifyAdmin, upload.single("image"), blogController.createPost);
router.get('/blog/:postId', blogController.getPost);
router.get('/blog', blogController.getAllPosts);
router.delete('/blog/:id', verifyToken, verifyAdmin, blogController.deleteBlog);
router.put('/putBlog/:id', verifyToken, verifyAdmin, upload.single("image"), blogController.updatePost);



module.exports = router;
