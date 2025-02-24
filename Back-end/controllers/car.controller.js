const CarModel = require("../models/car.model");

const getAllCar = async (req, res) => {
  const carList = await CarModel.find().populate(
    "carType",
    "bunkBed flue transmissionType"
  );
  if (carList && carList.length > 0) {
    return res.status(200).json(carList);
  } else {
    res.status(400).json({
      status: "error",
      message: "Car List do not have any element",
    });
  }
};

module.exports = { getAllCar };
