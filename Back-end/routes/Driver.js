const express = require("express");
const router = express.Router();

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
