const RequestModel = require("../models/request.model");

const createRequest = async (req, res) => {
  const data = req.body;
  const requestModel = new RequestModel({
    user: data.userId,
    driver: data.driverId != "" ? data.driverId : null,
    car: data.carId,
    startDate: data.startDate,
    endDate: data.endDate,
    requestStatus: "1",
    isRequestDriver: data.isRequestDriver,
  });
  const requestExisted = await RequestModel.findOne({
    user: data.userId,
    requestStatus: "1",
  });
  if (!requestExisted) {
    try {
      await requestModel.save();
      return res.status(200).json({ message: "Create Successfull !!!" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const carExistedOnRequest = requestExisted.car.filter(
      (item) => item._id == data.carId
    );
    if (carExistedOnRequest.length > 0) {
      return res
        .status(400)
        .json({ message: "This car is already existed in your request !!" });
    } else {
      await RequestModel.updateOne(
        { _id: requestExisted.id },
        { $push: { car: data.carId } }
      );
      return res.status(200).json({ message: "Update Successfull !!!" });
    }
  }
};

const getListRequest = async (req, res) => {
  const userId = req.query.key;
  try {
    const requestList = await RequestModel.find({ user: userId })
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate(
        "car",
        "carName color licensePlateNumber price carVersion images numberOfSeat"
      );
    return res.status(200).json(requestList);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createRequest,
  getListRequest,
};
