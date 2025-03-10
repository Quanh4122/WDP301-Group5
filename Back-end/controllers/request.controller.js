const RequestModel = require("../models/request.model");
const UserModel = require("../models/user.model");

const createRequest = async (req, res) => {
  const data = req.body;

  const requestModel = new RequestModel({
    user: data.user,
    driver: data.driver || [],
    car: data.car,
    // startDate: data.startDate,
    // endDate: data.endDate,
    requestStatus: data.requestStatus,
    isRequestDriver: data.isRequestDriver,
  });
  const requestExisted = await RequestModel.findOne({
    user: data.user,
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
      (item) => item._id == data.car
    );
    if (carExistedOnRequest.length > 0) {
      return res
        .status(400)
        .json({ message: "This car is already existed in your request !!" });
    } else {
      await RequestModel.updateOne(
        { _id: requestExisted.id },
        { $push: { car: data.car } }
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

const acceptBookingRequest = async (req, res) => {
  const data = req.body;

  try {
    const requestExisted = await RequestModel.findOne({
      user: data.user,
      requestStatus: "1",
    });
    if (requestExisted) {
      await UserModel.updateOne(
        { _id: data.user._id },
        {
          userName: data.user.userName,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          address: data.user.address,
        }
      );
      await RequestModel.updateOne(
        { _id: requestExisted._id },
        {
          startDate: data.startDate,
          endDate: data.endDate,
          isRequestDriver: data.isRequestDriver,
          requestStatus: data.requestStatus,
        }
      );
      return res.status(200).json({ message: "Request successfull !!" });
    } else {
      return res.status(401).json({ message: "Cannot find your request !!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  createRequest,
  getListRequest,
  acceptBookingRequest,
};
