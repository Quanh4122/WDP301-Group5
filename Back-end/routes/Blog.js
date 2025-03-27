const express = require('express');
const router = express.Router();
const upload = require("../middlewares/Upload");

const blogController = require('../controllers/blog.controller');
const verifyToken = require('../middlewares/VerifyToken');
const verifyAdmin = require('../middlewares/VerifyAdmin');
const upload = require("../middlewares/Upload");


router.post('/postBlog', verifyToken, verifyAdmin, blogController.createPost);
router.get('/blog/:postId', blogController.getPost);
router.get('/blog', blogController.getAllPosts);
router.delete('/blog/:id', blogController.deleteBlog)
router.put('/update-blog/:id', blogController.updateBlog)
router.post("/upload-blog-image", upload.single("avatar"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ imageUrl: `/images/${req.file.filename}` });
  });



  router.post("/upload-blog-thumbnail", upload.single("thumbnail"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: `/images/${req.file.filename}` });
  });


module.exports = router;
