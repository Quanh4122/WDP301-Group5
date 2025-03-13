const express = require("express");
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


const driverController = require("../controllers/driver.controller");
const VerifyToken = require("../middlewares/VerifyToken");
const VerifyDriver = require("../middlewares/VerifyDriver");

router.post(
  "/createDriver",
  VerifyToken,
  VerifyDriver,
  driverController.createDriver
);
router.get(
  "/driver/:id",
  VerifyToken,
  VerifyDriver,
  driverController.getDriver
);
router.get(
  "/driver",
  VerifyToken,
  VerifyDriver,
  driverController.getAllDrivers
);
router.get("/driverFree", VerifyToken, driverController.getAllFreeDrivers);

module.exports = router;
