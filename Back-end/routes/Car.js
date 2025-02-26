const express = require("express");
const router = express.Router();

const CarController = require("../controllers/car.controller");

router.get("/getAllCar", CarController.getAllCar);
router.post("/filterCarByNumberOfSeat", CarController.filterCarByNumberOfSeat);
router.post(
  "/filterCarByTransmissionType",
  CarController.filterCarByTransmissionType
);
router.post("/filterCarByFlue", CarController.filterCarByFlue);
module.exports = router;
