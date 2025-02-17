const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/users', verifyToken, userController.getUserById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', verifyToken, userController.logout);
// router.post('/forgotPassword', userController.forgotPassword);
// router.post('/resetPassword/:token', verifyToken, userController.resetPassword);
// router.get('/logout', verifyToken, userController.logout);
// router.post('/changePassword/:id', verifyToken, userController.changePassword);
// router.put('/editProfile/:userId', verifyToken, userController.updateUser);




module.exports = router;
