const express = require("express");
const router = express.Router();

const CarController = require("../controllers/car.controller");
const upload = require("../middlewares/Upload");

router.get("/getAllCar", CarController.getAllCar);
router.post("/filterCarByNumberOfSeat", CarController.filterCarByNumberOfSeat);
router.post(
  "/filterCarByTransmissionType",
  CarController.filterCarByTransmissionType
);
router.post("/filterCarByFlue", CarController.filterCarByFlue);
router.get("/getCarById", CarController.getCarById);
router.post("/createCar", upload.array("images", 4), CarController.createCar);

module.exports = router;