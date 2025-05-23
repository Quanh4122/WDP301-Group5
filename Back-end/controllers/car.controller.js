const CarModel = require("../models/car.model");
const CarTypeModel = require("../models/cartype.model");
const RequestModel = require("../models/request.model");

const getAllCar = async (req, res) => {
  const carList = await CarModel.find({ carStatus: false }).populate(
    "carType",
    "bunkBed flue transmissionType"
  );
  if (carList && carList.length > 0) {
    return res.status(200).json(carList);
  } else {
    return res.status(400).json({
      status: "error",
      message: "Car List do not have any element",
    });
  }
};

const filterCarByNumberOfSeat = async (req, res) => {
  const listReq = req.body;
  const carListFilter = await CarModel.find({
    numberOfSeat: { $in: listReq },
    carStatus: false,
  }).populate("carType", "bunkBed flue transmissionType");
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    return res.status(200).json([]);
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
        carStatus: false,
      },
    },
  ]);
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    return res.status(200).json([]);
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
        carStatus: false,
      },
    },
  ]);
  if (carListFilter && carListFilter.length > 0) {
    return res.status(200).json(carListFilter);
  } else {
    return res.status(200).json([]);
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
    return res.status(400).json({
      status: "error",
      message: "Car List do not have any element",
    });
  }
};

const createCar = async (req, res) => {
  const {
    carName,
    carStatus,
    carVersion,
    color,
    licensePlateNumber,
    numberOfSeat,
    images,
    price,
    bunkBed,
    flue,
    transmissionType,
  } = req.body;

  const carTypeModel = await CarTypeModel.findOne({
    bunkBed: bunkBed,
    flue: flue,
    transmissionType: transmissionType,
  });
  if (req.files.length == 0) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return res.status(400).json({ message: error.message });
  } else {
    const arrImages = req.files.map((item) => {
      return `/images/${item.filename}`;
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
    const carFindByLicensePlateNumber = await CarModel.findOne({
      licensePlateNumber: licensePlateNumber,
    });
    if (carFindByLicensePlateNumber) {
      return res.status(401).json({ message: "This car is existed !!!" });
    } else {
      await carModel.save();
      return res.status(200).json({ message: "Create Successfull !!!" });
    }
  }
};

const getAllCarFree = async (req, res) => {
  const data = req.query.key;
  if (data[0] && data[1]) {
    const listCarInAcceptRequest = await RequestModel.find(
      {
        requestStatus: { $nin: ["2", "7", "8", "5"] },
        $or: [
          {
            startDate: { $lte: data[0] },
            endDate: { $gte: data[0] },
          },
          {
            startDate: { $lte: data[1] },
            endDate: { $gte: data[1] },
          },
          {
            startDate: { $gte: data[0] },
            endDate: { $lte: data[1] },
          },
        ],
      },
      "car -_id"
    );
    if (listCarInAcceptRequest.length > 0) {
      const arrStr = listCarInAcceptRequest.flatMap((item) =>
        item.car.map((objectId) => objectId.toString())
      );

      const newArrStr = arrStr.filter(
        (item, index) => arrStr.indexOf(item) == index
      );

      const carList = await CarModel.find({
        _id: { $nin: newArrStr },
        carStatus: false,
      }).populate("carType", "bunkBed flue transmissionType");
      if (carList && carList.length > 0) {
        return res.status(200).json(carList);
      } else {
        return res.status(400).json({
          status: "error",
          message: "Car List do not have any element",
        });
      }
    } else {
      const carList = await CarModel.find().populate(
        "carType",
        "bunkBed flue transmissionType"
      );
      if (carList && carList.length > 0) {
        return res.status(200).json(carList);
      } else {
        return res.status(400).json({
          status: "error",
          message: "Car List do not have any element",
        });
      }
    }
  }
};

const getBusyCar = async (req, res) => {
  const data = req.query.key;
  if (data[0] && data[1]) {
    const listCarInAcceptRequest = await RequestModel.find(
      {
        requestStatus: { $nin: ["2", "7", "8", "5"] },
        $or: [
          {
            startDate: { $lte: data[0] },
            endDate: { $gte: data[0] },
          },
          {
            startDate: { $lte: data[1] },
            endDate: { $gte: data[1] },
          },
          {
            startDate: { $gte: data[0] },
            endDate: { $lte: data[1] },
          },
        ],
      },
      "car -_id"
    );
    if (listCarInAcceptRequest.length > 0) {
      const arrStr = listCarInAcceptRequest.flatMap((item) =>
        item.car.map((objectId) => objectId.toString())
      );

      const newArrStr = arrStr.filter(
        (item, index) => arrStr.indexOf(item) == index
      );
      return res.status(200).json(newArrStr);
    } else {
      return res.status(200).json([]);
    }
  } else {
    return res.status(400).json({ message: "Chưa có khoảng thời gian!!" });
  }
};

const updateCar = async (req, res) => {
  const {
    carName,
    carStatus,
    carVersion,
    color,
    images,
    licensePlateNumber,
    numberOfSeat,
    price,
    bunkBed,
    flue,
    transmissionType,
  } = req.body;

  const { carId } = req.params;

  const carTypeModel = await CarTypeModel.findOne({
    bunkBed: bunkBed,
    flue: flue,
    transmissionType: transmissionType,
  });
  if (req.files.length == 0) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return res.status(301).json({ message: error.message });
  } else {
    const arrImages = req.files.map((item) => {
      return `/images/${item.filename}`;
    });
    // const carFindByLicensePlateNumber = await CarModel.findOne({
    //   licensePlateNumber: licensePlateNumber,
    // });
    // if (carFindByLicensePlateNumber) {

    // } else {
    //   return res.status(401).json({ message: "This car is existed !!!" })
    // }
    await CarModel.updateOne(
      { _id: carId },
      {
        carName: carName,
        carStatus: carStatus,
        carType: carTypeModel._id,
        carVersion: carVersion,
        color: color,
        images: arrImages,
        licensePlateNumber: licensePlateNumber,
        numberOfSeat: numberOfSeat,
        price: price,
        carType: carTypeModel.id,
      }
    );
    return res.status(200).json({ message: "Create Successfull !!!" });
  }
};

const onDeleteCar = async (req, res) => {
  const { carId } = req.params;
  try {
    await CarModel.updateOne({ _id: carId }, { carStatus: true });
    return res.status(200).json({ message: "Delete successfull !!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  getAllCar,
  filterCarByNumberOfSeat,
  filterCarByTransmissionType,
  filterCarByFlue,
  getCarById,
  createCar,
  getAllCarFree,
  updateCar,
  onDeleteCar,
  getBusyCar,
};
