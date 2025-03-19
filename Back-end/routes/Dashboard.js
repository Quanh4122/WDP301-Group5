const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/dashboard.controller');


router.get('/userTrend', DashboardController.getUserTrend);
router.get('/requestTrend', DashboardController.getRequestTrend);
router.get('/getCarAvailability', DashboardController.getCarAvailability)



module.exports = router;
