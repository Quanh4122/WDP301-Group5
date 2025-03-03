const RequestModel = require("../models/request.model");
const dayjs = require("dayjs");

const createRequest = async (req, res) => {
  const data = req.body;
  const requestModel = new RequestModel({
    userId: data.userId,
    driverId: data.driverId != "" ? data.driverId : null,
    carId: data.carId,
    startDate: dayjs(data.startDate, "DD/MM/YYYY HH:mm"),
    endDate: dayjs(data.endDate, "DD/MM/YYYY HH:mm"),
    isRequestDriver: data.isRequestDriver,
  });
  try {
    await requestModel.save();
    return res.status(200).json({ message: "Create Successfull !!!" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createRequest,
};
