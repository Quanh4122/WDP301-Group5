const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/VerifyToken");
const upload = require("../middlewares/Upload");

router.post("/register", userController.register);
router.post("/verify", userController.verifyOTP);
// router.post('/sendOtp', verifyToken, userController.sendOTP);
router.post("/login", userController.login);
router.post("/google-login", userController.googleLogin);
router.get("/logout", verifyToken, userController.logout);
router.get("/getUserById", userController.getUserById);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.post(
  "/changePassword/:userId",
  verifyToken,
  userController.changePassword
);
router.put(
  "/editProfile/:userId",
  verifyToken,
  upload.single("avatar"),
  userController.editProfile
);

module.exports = router;
