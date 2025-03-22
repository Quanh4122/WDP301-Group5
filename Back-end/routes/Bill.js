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

module.exports = router;
