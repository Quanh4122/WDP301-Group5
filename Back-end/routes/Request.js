const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/request.controller");
const VerifyToken = require("../middlewares/VerifyToken");
const VerifyAdmin = require("../middlewares/VerifyAdmin");

router.post("/createRequest", VerifyToken, RequestController.createRequest);
router.get("/getListRequest", VerifyToken, RequestController.getListRequest);
router.post(
  "/userAcceptRequest",
  VerifyToken,
  RequestController.acceptBookingRequest
);
router.put(
  "/userDeleteCarInRequest",
  VerifyToken,
  RequestController.userDeleteCarInRequest
);
router.get(
  "/getListAdminRequest",
  VerifyToken,
  RequestController.listAdminAcceptRequest
);

module.exports = router;
