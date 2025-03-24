require("dotenv").config();
const BillModel = require("../models/bill.model");
const RequestModel = require("../models/request.model");
const NotifyPayment = require("../Templates/Mail/notifyPayment");
const mailService = require("../services/sendMail");
const dayjs = require("dayjs");
const NotifyBill = require("../Templates/Mail/notifyBill");
const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");

const getAllBill = async (req, res) => {
  try {
    const bills = await BillModel.find().populate({
      path: "requestId",
      select: "-requestStatus -driver -car -isRequestDriver",
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving bills: " + error.message });
  }
};

const toggleBillStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    console.log(billId);

    // Find the bill by ID
    const bill = await BillModel.findById(billId);
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    // Toggle the billStatus value
    bill.billStatus = !bill.billStatus;
    await bill.save();

    res.status(200).json(bill);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error toggling bill status: " + error.message });
  }
};

const useBookingBill = async (req, res) => {
  const { body: data } = req;

  try {
    // Bước 1: Kiểm tra xem hóa đơn đã tồn tại chưa
    const existingBill = await BillModel.findOne({ request: data.request._id });
    if (existingBill) {
      return res
        .status(400)
        .json({ message: "Bill already exists for this request!" });
    }

    // Bước 2: Kiểm tra request có tồn tại không
    const request = await RequestModel.findOne({ _id: data.request._id });
    if (!request) {
      return res.status(404).json({ message: "Request does not exist!" });
    }

    if (data.request.isRequestDriver) {
      // Bước 3: Kiểm tra vai trò tài xế (Driver Role)
      const driverRole = await RoleModel.findOne({ roleName: "Driver" });
      if (!driverRole) {
        return res.status(404).json({ message: "Driver role not found!" });
      }

      // Bước 4: Lấy danh sách tài xế theo vai trò
      const availableDrivers = await UserModel.find({
        role: driverRole._id,
      }).exec();
      if (availableDrivers.length === 0) {
        return res
          .status(400)
          .json({ message: "No drivers available for hire!" });
      }

      // Bước 5: Xác định số lượng xe và kiểm tra tài xế đủ hay không
      const requiredCars = request.car.length; // Số lượng xe trong request
      if (availableDrivers.length < requiredCars) {
        return res.status(400).json({
          message:
            "Not enough drivers available! You can reduce the number of cars or opt for driverless rental.",
        });
      }

      // Bước 6: Logic chọn số lượng tài xế bằng số lượng xe nếu cần tài xế
      let selectedDriverIds = [];
      if (data.request.isRequestDriver === true) {
        // Chọn ngẫu nhiên số lượng tài xế bằng số lượng xe
        const numberOfDriversToSelect = requiredCars;
        if (availableDrivers.length < numberOfDriversToSelect) {
          return res.status(400).json({
            message: "Not enough drivers to match the number of cars!",
          });
        }

        // Xáo trộn mảng và lấy số lượng tài xế cần thiết
        const shuffledDrivers = availableDrivers.sort(
          () => 0.5 - Math.random()
        );
        selectedDriverIds = shuffledDrivers
          .slice(0, numberOfDriversToSelect)
          .map((driver) => driver._id);
      }
    } else {
      // Bước 7: Cập nhật thông tin request (bao gồm danh sách driver nếu có)
      await RequestModel.updateOne(
        { _id: request._id },
        {
          requestStatus: data.request.requestStatus,
          pickUpLocation: data.request.pickUpLocation,
          isRequestDriver: data.request.isRequestDriver,
          startDate: data.request.startDate,
          endDate: data.request.endDate,
          emailRequest: data.request.emailRequest,
          dropLocation: data.request.dropLocation,
          driver: [], // Thêm danh sách _id của tài xế
        }
      );

      // Bước 8: Tạo hóa đơn mới
      const newBill = new BillModel({
        billStatus: false,
        request: request._id,
        depositFee: data.billData.depositFee,
        vatFee: data.billData.vatFee,
        totalCarFee: data.billData.totalCarFee,
      });
      await newBill.save();

      // Bước 9: Chuẩn bị nội dung email thông báo
      const emailContent = await NotifyBill(
        data.userName,
        data.billData.vatFee?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        data.billData.totalCarFee?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        data.billData.depositFee?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        dayjs(data.request.startDate).format("HH:mm DD/MM/YYYY"),
        dayjs(data.request.endDate).format("HH:mm DD/MM/YYYY"),
        data.request.pickUpLocation
      );

      // Bước 10: Gửi email thông báo
      await mailService.sendEmail({
        to: data.request.emailRequest,
        subject: "Vehicle Booking Request Notification",
        html: emailContent,
      });

      // Bước 11: Trả về phản hồi thành công
      return res.status(200).json({
        message: "Bill created successfully!",
      });
    }
  } catch (error) {
    console.error("Error in useBookingBill:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const userConfirmDoneBill = async (req, res) => {
  const data = req.body;
  const image = `/images/${req.file.filename}`;
  try {
    await BillModel.updateOne(
      {
        _id: data.bill,
      },
      {
        realLocationDrop: data.realDropLocation,
        realTimeDrop: dayjs(data.realTimeDrop),
        realImage: image,
      }
    );
    await RequestModel.updateOne({ _id: data.request }, { requestStatus: "4" });
    return res.status(200).json({ message: "Confirm successfull !!!" });
  } catch (error) {
    console.log(error);
  }
};

const getBillByRequestId = async (req, res) => {
  const requestId = req.query.key;
  try {
    if (requestId) {
      const bill = await BillModel.findOne({ request: requestId })
        .populate({
          path: "request", // Populate trường request từ Bill
          populate: {
            path: "car", // Populate trường car từ Request
            model: "Car",
          },
        })
        .exec();
      return res.status(200).json({ bill });
    } else {
      return res
        .status(401)
        .json({ message: "Request status have no data !!" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const adminUpdatePenaltyFee = async (req, res) => {
  const data = req.body;

  try {
    if (data) {
      const bill = await BillModel.findOneAndUpdate(
        {
          _id: data.billId,
        },
        {
          penaltyFee: data.penaltyFee || 0,
        }
      );
      const requestModal = await RequestModel.findOneAndUpdate(
        {
          _id: bill.request._id,
        },
        {
          requestStatus: "5",
        }
      ).populate("user", "userName fullName email phoneNumber address avatar");
      const bookingAgainURL = `http://localhost:3000/app/bill-payment?billId=${bill._id}`;
      const total = bill.vatFee + bill.totalCarFee - bill.depositFee;
      const emailContent = await NotifyPayment(
        `${requestModal.user.userName}`,
        bookingAgainURL,
        bill.vatFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        bill.totalCarFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        bill.depositFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        total.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      );
      await mailService.sendEmail({
        to: requestModal.user.email,
        subject: "Thông báo yêu cầu đặt xe",
        html: emailContent,
      });
      return res.status(200).json({
        status: "success",
        message: "Successfull !!!",
      });
    }

    return res.status(401).json({ message: "Have no data to update !!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getBillById = async (req, res) => {
  const billId = req.query.key;
  try {
    if (billId) {
      const bill = await BillModel.findOne({ _id: billId })
        .populate({
          path: "request", // Populate trường request từ Bill
          populate: {
            path: "car", // Populate trường car từ Request
            model: "Car",
          },
        })
        .exec();
      return res.status(200).json(bill);
    } else {
      return res
        .status(401)
        .json({ message: "Request status have no data !!" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const userAcceptPayment = async (req, res) => {
  const data = req.body;
  try {
    if (data.billId && data.requestId) {
      await BillModel.updateOne(
        {
          _id: data.billId,
        },
        {
          billStatus: true,
        }
      );
      await RequestModel.updateOne(
        {
          _id: data.requestId,
        },
        {
          requestStatus: "6",
        }
      );
      return res.status(200).json({ message: "Successfull Pay !!!" });
    } else {
      res.status(300).json({ message: "BillID or RequestID may be null !!" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  getAllBill,
  toggleBillStatus,
  useBookingBill,
  userConfirmDoneBill,
  getBillByRequestId,
  adminUpdatePenaltyFee,
  getBillById,
  userAcceptPayment,
};
