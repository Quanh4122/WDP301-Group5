require("dotenv").config();
const BillModel = require("../models/bill.model");
const RequestModel = require("../models/request.model");
const NotifyBill = require("../Templates/Mail/notifyBill");
const mailService = require("../services/sendMail");
const dayjs = require("dayjs");

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
  try {
    console.log(data);
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
      data.request.startDate,
      data.request.endDate,
      data.request.pickUpLocation
    );

    await mailService.sendEmail({
      to: data.request.emailRequest,
      subject: "Thông báo yêu cầu đặt xe",
      html: emailContent,
    });
    return res.status(200).json({ message: "Create bill successfull !!!" });
  } catch (error) {
    console.log(error);
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

module.exports = {
  getAllBill,
  toggleBillStatus,
  useBookingBill,
  userConfirmDoneBill,
  getBillByRequestId,
};
