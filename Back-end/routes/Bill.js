const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Upload");
const billController = require("../controllers/bill.controller");

router.get("/bill", billController.getAllBill);
router.patch("/bill/:billId", billController.toggleBillStatus);
router.post("/bill/userBookingBill", billController.useBookingBill);
router.post(
  "/bill/userConfirmDoneBill",
  upload.single("images", 1),
  billController.userConfirmDoneBill
);
router.get("/bill/getBillByReuqestId", billController.getBillByRequestId);
router.get("/bill/getBillById", billController.getBillById);
router.put("/bill/adminUpdatePenaltyFee", billController.adminUpdatePenaltyFee);
router.put("/bill/userAcceptPayment", billController.userAcceptPayment);

module.exports = router;
