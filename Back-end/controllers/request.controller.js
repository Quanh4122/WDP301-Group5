require("dotenv").config();
const RequestModel = require("../models/request.model");
const CarModel = require("../models/car.model");
const UserModel = require("../models/user.model");
const NotifyRequest = require("../Templates/Mail/notifyRequest");
const NotifyBill = require("../Templates/Mail/notifyBill");
const mailService = require("../services/sendMail");
const dayjs = require("dayjs");
const BillModel = require("../models/bill.model");

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
  try {
    const requestExisted = await RequestModel.findOne({
      _id: data._id,
    })
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate(
        "car",
        "carName color licensePlateNumber price carVersion images numberOfSeat"
      );
    if (requestExisted) {
      const start = dayjs(data.startDate);
      const end = dayjs(data.endDate);
      const totalHours = end.diff(start, "hour", true);
      const startDate = start.format("HH:mm, DD/MM/YYYY");
      const endDate = end.format("HH:mm, DD/MM/YYYY");

      const carPrices = requestExisted?.car?.map((item) => item.price) ?? [];
      const totalPrice = carPrices.reduce(
        (total, current) => total + current,
        0
      );
      const vatFee = totalPrice * totalHours * 0.1;
      const totalFee = vatFee + totalPrice * totalHours;
      const displayTotalFee = totalFee.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      const emailContent = await NotifyBill(
        `${data.user.userName}`,
        vatFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        (totalPrice * totalHours).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        displayTotalFee,
        startDate,
        endDate,
        data.pickUpLocation
      );

      await mailService.sendEmail({
        to: data.emailRequest,
        subject: "Thông báo yêu cầu đặt xe",
        html: emailContent,
      });
      await UserModel.updateOne(
        { _id: data.user._id },
        {
          userName: data.user.userName,
          phoneNumber: data.user.phoneNumber,
        }
      );
      await RequestModel.updateOne(
        { _id: requestExisted._id },
        {
          startDate: data.startDate,
          endDate: data.endDate,
          isRequestDriver: data.isRequestDriver,
          requestStatus: data.requestStatus,
          $push: { car: data.car },
          pickUpLocation: data.pickUpLocation,
          emailRequest: data.emailRequest,
        }
      );
      return res.status(200).json({ message: "Successfull" });
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
    const dataRequest = await RequestModel.findOne({ _id: dt.requestId })
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
        // Update the request with assigned driver and new status
        await RequestModel.updateOne(
          { _id: dt.requestId },
          {
            driver: dt.driver,
            requestStatus: "3",
          }
        );

        // Create a new Bill document. The Bill model's pre-save hook
        // will compute the 'total' based on the Request's car prices.
        const newBill = await BillModel.create({
          requestId: dt.requestId,
        });

        await mailService.sendEmail({
          to: dataRequest.user.email,
          subject: "Thông báo yêu cầu đặt xe",
          html: emailContent,
        });
        return res.status(200).json({
          status: "success",
          message: "Successful !!",
          bill: newBill, // optionally return bill details
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
          message: "Successful !!!",
        });
      }
      return res.status(200).json({ message: "Successfull !!!" });
    } else {
      return res.status(401).json({ message: "Cannot find this request !!!" });
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
        requestStatus: { $nin: ["1", "6"] },
        $and: [
          { startDate: { $lt: dt.endDate } },
          { endDate: { $gt: dt.startDate } },
        ],
      },
      "car -_id"
    );

    const listReqDriverInRangeTime = await RequestModel.find(
      {
        _id: { $ne: dataRequest._id },
        requestStatus: { $in: ["1", "5"] },
        $and: [
          { startDate: { $lt: dt.endDate } },
          { endDate: { $gt: dt.startDate } },
        ],
      },
      "driver -_id"
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

const handleCheckCar = async (req, res) => {};

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

const getRequestById = async (req, res) => {
  const requestId = req.query.key;
  try {
    const requestList = await RequestModel.findOne({ _id: requestId })
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

const getRequestsByDriverId = async (req, res) => {
  const { driverId } = req.query; // Lấy driverId từ query params

  if (!mongoose.Types.ObjectId.isValid(driverId)) {
    return res.status(400).json({ message: "Invalid driverId format" });
  }

  try {
    const requestList = await RequestModel.find({
      driver: new mongoose.Types.ObjectId(driverId),
    })
      .populate("user", "userName fullName email phoneNumber address avatar")
      .populate(
        "car",
        "carName color licensePlateNumber price carVersion images numberOfSeat"
      );

    return res.status(200).json(requestList.length ? requestList : []);
  } catch (error) {
    console.error("Error fetching requests by driver ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestModel.find();

    if (!requests.length) {
      return res.status(404).json({ message: "No requests found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const selectFavoriteCar = async (req, res) => {
  try {
    // // Bước 1: Lấy top 3 xe xuất hiện nhiều nhất trong request
    // const topCarsFromRequests = await RequestModel.aggregate([
    //   // Tách mảng car thành từng document
    //   { $unwind: "$car" },
    //   // Nhóm theo car và đếm số lần xuất hiện
    //   {
    //     $group: {
    //       _id: "$car",
    //       requestCount: { $sum: 1 },
    //     },
    //   },
    //   // Sắp xếp theo số lần xuất hiện giảm dần
    //   { $sort: { requestCount: -1 } },
    //   // Giới hạn lấy 3 xe
    //   { $limit: 3 },
    //   // Join với CarModel để lấy tất cả thông tin xe
    //   {
    //     $lookup: {
    //       from: "cars", // Tên collection của CarModel trong MongoDB
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "carDetails",
    //     },
    //   },
    //   // Tách mảng carDetails
    //   { $unwind: "$carDetails" },
    //   // Join với CarTypeModel để lấy thông tin carType
    //   {
    //     $lookup: {
    //       from: "cartypes", // Tên collection của CarTypeModel trong MongoDB
    //       localField: "carDetails.carType",
    //       foreignField: "_id",
    //       as: "carTypeDetails",
    //     },
    //   },
    //   // Tách mảng carTypeDetails (nếu có)
    //   { $unwind: "$carTypeDetails" },
    //   // Dựng lại cấu trúc kết quả
    //   {
    //     $project: {
    //       _id: "$carDetails._id",
    //       carName: "$carDetails.carName",
    //       color: "$carDetails.color",
    //       images: "$carDetails.images",
    //       carStatus: "$carDetails.carStatus",
    //       licensePlateNumber: "$carDetails.licensePlateNumber",
    //       price: "$carDetails.price",
    //       carVersion: "$carDetails.carVersion",
    //       numberOfSeat: "$carDetails.numberOfSeat",
    //       carType: {
    //         bunkBed: "$carTypeDetails.bunkBed",
    //         flue: "$carTypeDetails.flue",
    //         transmissionType: "$carTypeDetails.transmissionType",
    //       },
    //       requestCount: 1,
    //     },
    //   },
    // ]);

    // // Số lượng xe từ request
    // const numberOfCars = topCarsFromRequests.length;

    // // Nếu đủ 3 xe, trả về luôn
    // if (numberOfCars >= 3) {
    //   return topCarsFromRequests;
    // }

    // Bước 2: Nếu không đủ 3 xe, lấy thêm từ CarModel theo carVersion
    const remainingCount = 3;
    const additionalCars = await CarModel.aggregate([
      // Join với CarTypeModel
      {
        $lookup: {
          from: "cartypes",
          localField: "carType",
          foreignField: "_id",
          as: "carTypeDetails",
        },
      },
      { $unwind: "$carTypeDetails" },
      // Sắp xếp theo carVersion giảm dần
      { $sort: { carVersion: -1 } },
      // Giới hạn số xe còn thiếu
      { $limit: remainingCount },
      // Dựng lại cấu trúc kết quả
      {
        $project: {
          _id: 1,
          carName: 1,
          color: 1,
          images: 1,
          carStatus: 1,
          licensePlateNumber: 1,
          price: 1,
          carVersion: 1,
          numberOfSeat: 1,
          carType: {
            bunkBed: "$carTypeDetails.bunkBed",
            flue: "$carTypeDetails.flue",
            transmissionType: "$carTypeDetails.transmissionType",
          },
        },
      },
    ]);

    // Kết hợp kết quả
    const result = [
      // ...topCarsFromRequests,
      ...additionalCars.map((car) => ({
        ...car,
        // requestCount: 0, // Xe bổ sung không có request
      })),
    ];

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error);
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
  getRequestById,
  selectFavoriteCar,
  getRequestsByDriverId,
  getAllRequests,
};
