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

const filterCarByNumberOfSeat = async (req, res) => {
  const listReq = req.body;
  const carListFilter = await CarModel.find({
    numberOfSeat: { $in: listReq },
  }).populate("carType", "bunkBed flue transmissionType");
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    res.status(200).json([]);
  }
};

const filterCarByTransmissionType = async (req, res) => {
  const listReq = req.body;
  const carListFilter = await CarModel.aggregate([
    {
      $lookup: {
        from: "cartypes",
        localField: "carType",
        foreignField: "_id",
        as: "carType",
      },
    },
    {
      $match: {
        "carType.transmissionType": { $in: listReq }, // Lọc theo danh sách giá trị bunkBed
      },
    },
  ]);
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    res.status(200).json([]);
  }
};

const filterCarByFlue = async (req, res) => {
  const listReq = req.body;
  const carListFilter = await CarModel.aggregate([
    {
      $lookup: {
        from: "cartypes",
        localField: "carType",
        foreignField: "_id",
        as: "carType",
      },
    },
    {
      $match: {
        "carType.flue": { $in: listReq }, // Lọc theo danh sách giá trị bunkBed
      },
    },
  ]);
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    res.status(200).json([]);
  }
};

module.exports = {
  getAllCar,
  filterCarByNumberOfSeat,
  filterCarByTransmissionType,
  filterCarByFlue,
};
