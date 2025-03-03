const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller');

router.post('/createDriver', driverController.createDriver);
router.get('/driver/:id', driverController.getDriver);
router.get('/driver', driverController.getAllDrivers);



module.exports = router;
