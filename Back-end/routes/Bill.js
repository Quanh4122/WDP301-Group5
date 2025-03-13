const express = require('express');
const router = express.Router();

const billController = require('../controllers/bill.controller');

router.get('/bill', billController.getAllBill);
router.patch('/bill/:billId', billController.toggleBillStatus)


module.exports = router;
