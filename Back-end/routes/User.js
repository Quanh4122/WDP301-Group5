const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/VerifyToken');
const Upload = require('../middlewares/Upload');
const upload = require('../middlewares/Upload');

router.post('/register', userController.register);
router.post("/verify", userController.verifyOTP);
// router.post('/sendOtp', verifyToken, userController.sendOTP);
router.post('/login', userController.login);
router.get('/logout', verifyToken, userController.logout);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.put('/editProfile/:userId', upload.single("avatar"), userController.editProfile);




module.exports = router;
