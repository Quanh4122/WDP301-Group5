require("dotenv").config();
const BillModel = require("../models/bill.model");
const RequestModel = require("../models/request.model");
const NotifyPayment = require("../Templates/Mail/notifyPayment");
const mailService = require("../services/sendMail");
const dayjs = require("dayjs");
const NotifyBill = require("../Templates/Mail/notifyBill");

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
  const data = req.body;
  try {
    const checkBillExisted = await BillModel.findOne({
      request: data.request._id,
    });
    console.log(checkBillExisted);
    if (!checkBillExisted) {
      await RequestModel.updateOne(
        {
          _id: data.request._id,
        },
        {
          requestStatus: data.request.requestStatus,
          pickUpLocation: data.request.pickUpLocation,
          isRequestDriver: data.request.isRequestDriver,
          startDate: data.request.startDate,
          endDate: data.request.endDate,
          emailRequest: data.request.emailRequest,
          dropLocation: data.request.dropLocation,
        }
      );

      const bill = new BillModel({
        billStatus: false,
        request: data.request._id,
        depositFee: data.billData.depositFee,
        vatFee: data.billData.vatFee,
        totalCarFee: data.billData.totalCarFee,
      });

      await bill.save();

      const emailContent = await NotifyBill(
        `${data.userName}`,
        data.billData.vatFee &&
          data.billData.vatFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        data.billData.totalCarFee &&
          data.billData.totalCarFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        data.billData.depositFee &&
          data.billData.depositFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        dayjs(data.request.startDate).format("HH:mm DD/MM/YYYY"),
        dayjs(data.request.endDate).format("HH:mm DD/MM/YYYY"),
        data.request.pickUpLocation
      );

      await mailService.sendEmail({
        to: data.request.emailRequest,
        subject: "Thông báo yêu cầu đặt xe",
        html: emailContent,
      });
      return res.status(200).json({ message: "Create bill successfull !!!" });
    } else {
      return res.status(500).json({ message: "Bill have already booking !!" });
    }
  } catch (error) {
    return res.status(300).json(error);
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
      // const bill = await BillModel.findOneAndUpdate(
      //   {
      //     _id: data.billId,
      //   },
      //   {
      //     penaltyFee: data.penaltyFee || 0,
      //   }
      // );
      const bill = await BillModel.findOne({
        _id: data.billId,
      });
      // const requestModal = await RequestModel.findOneAndUpdate(
      //   {
      //     _id: bill.request._id,
      //   },
      //   {
      //     requestStatus: "5",
      //   }
      const requestModal = await RequestModel.findOne({
        _id: bill.request._id,
      }).populate("user", "userName fullName email phoneNumber address avatar");
      const bookingAgainURL = `http://localhost:3000/app/bill-payment?billId=${bill._id}`;
      let total = bill.vatFee + bill.totalCarFee;
      if (bill.depositFee) total = total - bill.depositFee;

      if (bill.penaltyFee) total = total + bill.penaltyFee;
      const emailContent = NotifyPayment(
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
        bill.depositFee
          ? bill.depositFee.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : 0,
        bill.penaltyFee
          ? bill.penaltyFee.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : 0,
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
    return res.status(400).json({ message: "check" + error });
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
          requestStatus: "5",
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
