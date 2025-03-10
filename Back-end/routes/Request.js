const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/request.controller");

router.post("/createRequest", RequestController.createRequest);
router.get("/getListRequest", RequestController.getListRequest);
router.post("/userAcceptRequest", RequestController.acceptBookingRequest);

module.exports = router;
