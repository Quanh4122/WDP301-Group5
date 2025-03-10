const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/dashboard.controller');


router.get('/userTrend', DashboardController.getUserTrend);



module.exports = router;
