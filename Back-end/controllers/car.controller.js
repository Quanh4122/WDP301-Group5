const CarModel = require("../models/car.model");
const CarTypeModel = require("../models/cartype.model");

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
      $unwind: "$carType", // Biến mảng carType thành các document riêng biệt
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
      $unwind: "$carType", // Biến mảng carType thành các document riêng biệt
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

const getCarById = async (req, res) => {
  const id = req.query.key;
  const car = await CarModel.findOne({ _id: id }).populate(
    "carType",
    "bunkBed flue transmissionType"
  );
  if (car) {
    return res.status(200).json(car);
  } else {
    res.status(400).json({
      status: "error",
      message: "Car List do not have any element",
    });
  }
};

const createCar = async (req, res) => {
  const {
    carName,
    carStatus,
    carType,
    carVersion,
    color,
    images,
    licensePlateNumber,
    numberOfSeat,
    price,
  } = req.body;

  const carTypeModel = await CarTypeModel.findOne({
    bunkBed: carType.bunkBed,
    flue: carType.flue,
    transmissionType: carType.transmissionType,
  });
  console.log(carType)

  if (images.length == 0) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    const arrImages = images.map((item) => {
      return `/images/${item}`;
    });

    const carModel = new CarModel({
      carName,
      carStatus,
      carType: carTypeModel._id,
      carVersion,
      color,
      images: arrImages,
      licensePlateNumber,
      numberOfSeat,
      price,
    });
    await carModel.save();
    return res.status(200).json({ message: "Create Successfull !!!" });
  }
};

module.exports = {
  getAllCar,
  filterCarByNumberOfSeat,
  filterCarByTransmissionType,
  filterCarByFlue,
  getCarById,
  createCar,
};
