const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Upload");
const billController = require("../controllers/bill.controller");

router.get("/bill", billController.getAllBill);
router.patch("/bill/:billId", billController.toggleBillStatus);
router.post("/bill/userBookingBill", billController.useBookingBill);
router.post(
  "/bill/userConfirmDoneBill",
  upload.array("images", 10),
  billController.userConfirmDoneBill
);
router.get("/bill/getBillByReuqestId", billController.getBillByRequestId);
router.get("/bill/getBillById", billController.getBillById);
router.put("/bill/adminUpdatePenaltyFee", billController.adminUpdatePenaltyFee);
router.put("/bill/userAcceptPayment", billController.userAcceptPayment);
router.put("/bill/userPayStatus3", billController.userPayStatus3);
router.put("/bill/userStatus4", billController.userStatus4);
router.put("/bill/userStatus8", billController.userStatus8);

module.exports = router;
