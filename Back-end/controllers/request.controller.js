require("dotenv").config();
const RequestModel = require("../models/request.model");
const UserModel = require("../models/user.model");
const NotifyRequest = require("../Templates/Mail/notifyRequest");
const mailService = require("../services/sendMail");
const dayjs = require("dayjs");

const createRequest = async (req, res) => {
  const data = req.body;
  const requestModel = new RequestModel({
    user: data.user,
    driver: data.driver || [],
    car: data.car,
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
  console.log(data);
  // try {
  //   if (data.car) {
  //     const requestExisted = await RequestModel.findOne({
  //       user: data.user._id,
  //       requestStatus: "4",
  //     });
  //     if (requestExisted) {
  //       await UserModel.updateOne(
  //         { _id: data.user._id },
  //         {
  //           userName: data.user.userName,
  //           email: data.user.email,
  //           phoneNumber: data.user.phoneNumber,
  //           address: data.user.address,
  //         }
  //       );
  //       await RequestModel.updateOne(
  //         { _id: requestExisted._id },
  //         {
  //           startDate: data.startDate,
  //           endDate: data.endDate,
  //           isRequestDriver: data.isRequestDriver,
  //           requestStatus: data.requestStatus,
  //           $push: { car: data.car },
  //           pickUpLocation: data.pickUpLocation,
  //         }
  //       );
  //       // await RequestModel.updateOne(
  //       //   { _id: requestExisted._id },
  //       //   {  }
  //       // );
  //       return res.status(200).json({ message: "Request successfull !!" });
  //     } else {
  //       return res.status(401).json({ message: "Cannot find your request !!" });
  //     }
  //   } else {
  //     const requestExisted = await RequestModel.findOne({
  //       user: data.user._id,
  //       requestStatus: "1",
  //     });
  //     if (requestExisted) {
  //       await UserModel.updateOne(
  //         { _id: data.user._id },
  //         {
  //           userName: data.user.userName,
  //           email: data.user.email,
  //           phoneNumber: data.user.phoneNumber,
  //           address: data.user.address,
  //         }
  //       );
  //       await RequestModel.updateOne(
  //         { _id: requestExisted._id },
  //         {
  //           startDate: data.startDate,
  //           endDate: data.endDate,
  //           isRequestDriver: data.isRequestDriver,
  //           requestStatus: data.requestStatus,
  //           pickUpLocation: data.pickUpLocation,
  //         }
  //       );
  //       return res.status(200).json({ message: "Request successfull !!" });
  //     } else {
  //       return res.status(401).json({ message: "Cannot find your request !!" });
  //     }
  //   }
  // } catch (error) {
  //   return res.status(500).json({ message: error });
  // }
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
    const dataRequest = await RequestModel.findOne({
      _id: dt.requestId,
    })
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate(
        "car",
        "carName color licensePlateNumber price carVersion images numberOfSeat"
      );

    if (dataRequest) {
      const lsDuplicate = dataRequest.car.map((item) => {
        const dupid = dt.duplicateCar.find((ele) => ele == item._id);
        if (dupid) return item;
      });
      const lstduplicateN = lsDuplicate.filter((item) => item != undefined);
      const start = dayjs(dataRequest.startDate);
      const end = dayjs(dataRequest.endDate);
      const totalHours = end.diff(start, "hour", true);
      const startDate = start.format("HH:mm, DD/MM/YYYY");
      const endDate = end.format("HH:mm, DD/MM/YYYY");

      const carPrices = dataRequest?.car?.map((item) => item.price) ?? [];
      const totalPrice = carPrices.reduce(
        (total, current) => total + current,
        0
      );
      const vatFee = totalPrice * totalHours * 0.1;
      const totalFee = vatFee + totalPrice * totalHours;
      const displayTotalFee = (totalFee * 1000).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      const bookingAgainURL = `http://localhost:3000/app/booking-list?userId=${dt.userId}`;
      const emailContent = await NotifyRequest(
        `${dataRequest.user.userName}`,
        bookingAgainURL,
        dt.isAccept,
        (vatFee * 1000).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        (totalPrice * totalHours * 1000).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        displayTotalFee,
        startDate,
        endDate,
        lstduplicateN
      );
      if (dt.isAccept) {
        await RequestModel.updateOne(
          { _id: dt.requestId },
          {
            driver: dt.driver,
            requestStatus: "3",
          }
        );
        await mailService.sendEmail({
          to: dataRequest.user.email,
          subject: "Thông báo yêu cầu đặt xe",
          html: emailContent,
        });
        return res.status(200).json({
          status: "success",
          message: "Successfull !!",
        });
      } else {
        await RequestModel.updateOne(
          { _id: dt.requestId },
          {
            requestStatus: "4",
          }
        );
        await mailService.sendEmail({
          to: dataRequest.user.email,
          subject: "Thông báo yêu cầu đặt xe",
          html: emailContent,
        });
        return res.status(200).json({
          status: "success",
          message: "Successfull !!!",
        });
      }
      // return res.status(200).json({ message: "Successfull !!!" });
    } else {
      //return res.status(401).json({ message: "Cannot find this request !!!" });
    }
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
        _id: { $ne: dataRequest._id },
        $and: [
          { startDate: { $lt: dt.endDate } },
          { endDate: { $gt: dt.startDate } },
        ],
      },
      "car -_id"
    );
    if (listReqInRangeTime.length > 0) {
      const listReqInRangeTimeOther = listReqInRangeTime.filter(
        (item) => item._id != dataRequest._id
      );
      const arrStr = listReqInRangeTimeOther.flatMap((item) =>
        item.car.map((objectId) => objectId.toString())
      );
      const dataRequestCar = dataRequest.car.map((objectId) =>
        objectId.toString()
      );
      const set1 = new Set(arrStr);
      const existed = dataRequestCar.filter((ele) => set1.has(ele));
      const val = dataRequestCar.some((element) => arrStr.includes(element));
      return res.status(200).json({ isExisted: val, duplicateCar: existed });
    } else {
      return res.status(200).json({ isExisted: false, duplicateCar: [] });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getAddress = async (req, res) => {
  const query = req.query.q; // Từ khóa người dùng nhập
  if (!query) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp từ khóa tìm kiếm" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=10&countrycodes=vn`,
      {
        headers: {
          "User-Agent": "MyAddressApp/1.0 (quangmanh279@gmail.com)", // Header của bạn
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Lỗi khi gọi API Nominatim: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data); // Trả về danh sách gợi ý địa chỉ
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return res.status(500).json({ error: "Lỗi khi tìm kiếm địa chỉ" });
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
  getAddress,
};
