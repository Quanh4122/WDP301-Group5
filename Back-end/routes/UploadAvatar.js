const express = require("express");
const upload = require("../middlewares/Upload");
const router = express.Router();

router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/images/${req.file.filename}` });
});

module.exports = router;