const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/request.controller");
const VerifyToken = require("../middlewares/VerifyToken");

router.post("/createRequest", VerifyToken, RequestController.createRequest);
router.get("/getListRequest", VerifyToken, RequestController.getListRequest);
router.post("/userAcceptRequest", VerifyToken, RequestController.acceptBookingRequest);

module.exports = router;
