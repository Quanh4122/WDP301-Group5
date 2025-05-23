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
router.post(
  "/handleAdminAcceptRequest",
  VerifyToken,
  RequestController.handleAdminAcceptRequest
);

router.post(
  "/handleCheckAdminAcceptRequest",
  VerifyToken,
  RequestController.handleCheckRequest
);
router.get("/getRequestsByDriverId", RequestController.getRequestsByDriverId);
router.get("/getAllRequest", RequestController.getAllRequests);

router.get("/search-address", RequestController.getAddress);

router.get("/getRequestById", VerifyToken, RequestController.getRequestById);

router.get("/selectFavoriteCar", RequestController.selectFavoriteCar);

router.post(
  "/handleCheckDriver",
  VerifyToken,
  RequestController.handleCheckDriver
);

module.exports = router;
