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
  try {
    await requestModel.save();
    return res.status(200).json({ message: "Create Successfull !!!" });
  } catch (error) {
    console.log(error);
  }
};

const getListRequest = async (req, res) => {
  try {
    const requestList = await RequestModel.find()
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate("car", "carName color licensePlateNumber price carVersion");
    return res.status(200).json(requestList);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createRequest,
  getListRequest,
};
