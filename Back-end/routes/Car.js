const express = require("express");
const router = express.Router();

const CarController = require("../controllers/car.controller");

router.get("/getAllCar", CarController.getAllCar);

module.exports = router;
