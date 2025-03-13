const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller');
const VerifyToken = require('../middlewares/VerifyToken');
const VerifyDriver = require('../middlewares/VerifyDriver');
const VerifyAdmin = require('../middlewares/VerifyAdmin');

router.post('/driver', VerifyToken, driverController.createDriver);
router.get('/driver/:id', driverController.getDriver);
router.get('/driver',VerifyToken, driverController.getAllDrivers);
router.put('/driver/:id',VerifyToken, driverController.updateDriver);
router.delete('/driver/:id',VerifyToken, driverController.deleteDriver);




module.exports = router;
