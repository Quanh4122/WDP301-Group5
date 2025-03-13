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
    car: {},
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
      (item) => item._id == data.car[0]
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
  console.log(userId.userId);
  try {
    const requestList = await RequestModel.find({ user: userId.userId })
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

const userDeleteCarInRequest = async (req, res) => {
  const data = req.body;
  try {
    await RequestModel.updateOne(
      { _id: data.requestId },
      {
        $pull: { car: data.car },
      }
    );
    const requestData = await RequestModel.findOne({ _id: data.requestId })
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate(
        "car",
        "carName color licensePlateNumber price carVersion images numberOfSeat"
      );
    return res.status(200).json(requestData);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const listAdminAcceptRequest = async (req, res) => {
  try {
    const requestList = await RequestModel.find({ requestStatus: { $ne: "1" } })
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

const handleAdminAcceptRequest = async (req, res) => {
  try {
    const dt = req.body;
    const dataRequest = await RequestModel.findOne({ _id: dt.requestId });
    if (dt.isAccept) {
      await RequestModel.updateOne(
        { _id: dt.requestId },
        {
          driver: dt.driver,
          requestStatus: "3",
        }
      );
    } else {
      await RequestModel.updateOne(
        { _id: dt.requestId },
        {
          requestStatus: "4",
        }
      );
    }
    return res.status(200).json({ message: "Successfull !!!" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const handleCheckRequest = async (req, res) => {
  try {
    const dt = req.body;
    const dataRequest = await RequestModel.findOne({ _id: dt.requestId });
    const listReqInRangeTime = await RequestModel.find(
      {
        $and: [
          { startDate: { $gte: dataRequest.startDate } },
          { endDate: { $lte: dataRequest.endDate } },
        ],
      },
      "car -_id"
    );

    const arrStr = listReqInRangeTime.flatMap((item) =>
      item.car.map((objectId) => objectId.toString())
    );
    const dataRequestCar = dataRequest.car.map((objectId) =>
      objectId.toString()
    );
    const val = dataRequestCar.some((element) => arrStr.includes(element));
    res.status(200).json(val);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = {
  createRequest,
  getListRequest,
  acceptBookingRequest,
  userDeleteCarInRequest,
  listAdminAcceptRequest,
  handleAdminAcceptRequest,
  handleCheckRequest,
};
