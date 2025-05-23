const UserModel = require("../models/user.model");
const RequestModel = require("../models/request.model");
const BillModel = require("../models/bill.model")
const dayjs = require("dayjs");
const CarModel = require("../models/car.model");

const getUserTrend = async (req, res) => {
  try {
    const today = new Date();
    // Set last30Days to 29 days before today so the period includes today (30 days total)
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 29);

    const users = await UserModel.aggregate([
      {
        $match: { createdAt: { $gte: last30Days } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log(users);

    // Create a map for quick lookup
    const dateMap = new Map(users.map((u) => [u._id, u.count]));

    // Build dailyCounts starting from last30Days up to today
    const dailyCounts = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(last30Days); // clone the base date
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      dailyCounts.push(dateMap.get(dateString) || 0);
    }

    const totalUsers = dailyCounts.reduce((a, b) => a + b, 0);
    const firstHalf = dailyCounts.slice(0, 15).reduce((a, b) => a + b, 0);
    const secondHalf = dailyCounts.slice(15).reduce((a, b) => a + b, 0);
    const trend = secondHalf >= firstHalf ? "up" : "down";

    res.json({
      title: "Số lượng người dùng trong hệ thống",
      value: totalUsers.toString(),
      interval: "30 ngày qua",
      trend,
      data: dailyCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRequestTrend = async (req, res) => {
  try {
    // Use today's date and set the period to the last 30 days (including today)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29); // 30-day window

    // Aggregate request counts grouped by day (formatted as YYYY-MM-DD)
    const results = await RequestModel.aggregate([
      {
        $match: {
          timeCreated: { $gte: startDate, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timeCreated" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Create a map for quick lookup of counts per day
    const dateMap = new Map(results.map((doc) => [doc._id, doc.count]));

    // Build an array of 30 daily counts, from startDate to today
    const dailyCounts = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate); // clone the start date
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dailyCounts.push(dateMap.get(dateStr) || 0);
    }

    // Calculate the total requests over the period
    const totalCount = dailyCounts.reduce((sum, count) => sum + count, 0);

    // Compute average counts for the first and second halves
    const firstHalfAvg =
      dailyCounts.slice(0, 15).reduce((sum, count) => sum + count, 0) / 15;
    const secondHalfAvg =
      dailyCounts.slice(15).reduce((sum, count) => sum + count, 0) / 15;

    // Determine the trend: 'up' if second half is greater, 'down' otherwise
    const trend = secondHalfAvg > firstHalfAvg ? "up" : "down";

    // Optionally, format total count in 'k' notation if >= 1000
    let valueStr = totalCount.toString();
    if (totalCount >= 1000) {
      valueStr = (totalCount / 1000).toFixed(1) + "k";
    }

    res.json({
      title: "Tổng số lương request",
      value: valueStr,
      interval: "30 ngày qua",
      trend,
      data: dailyCounts,
    });
  } catch (error) {
    console.error("Error fetching request trend:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCarAvailability = async (req, res) => {
  try {
    // Set today's date to midnight.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next30Days = 30;

    // Calculate the last day in the 30-day window.
    const lastDay = new Date(today);
    lastDay.setDate(lastDay.getDate() + next30Days - 1);

    // Query requests with status 2, 3, or 4 that overlap with the next 30 days.
    const requests = await RequestModel.find({
      requestStatus: { $in: ["2", "3", "4"] },
      startDate: { $lte: lastDay },
      endDate: { $gte: today },
    }).lean();

    // Get the total number of cars from the Car collection.
    const totalCars = await CarModel.countDocuments();

    // Prepare arrays for in-use and reserved counts for each day.
    const inUseData = Array(next30Days).fill(0);
    const reservedData = Array(next30Days).fill(0);

    // Loop over each day in the next 30 days.
    for (let i = 0; i < next30Days; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      // Use a Set to collect unique car IDs that are in use on this day.
      const carSet = new Set();
      requests.forEach(request => {
        const reqStart = new Date(request.startDate);
        const reqEnd = new Date(request.endDate);
        // Check if currentDay is within the request period (inclusive).
        if (currentDay >= reqStart && currentDay <= reqEnd) {
          if (Array.isArray(request.car)) {
            request.car.forEach(carId => carSet.add(carId.toString()));
          } else if (request.car) {
            carSet.add(request.car.toString());
          }
        }
      });
      const inUseCount = carSet.size;
      inUseData[i] = inUseCount;
      reservedData[i] = totalCars - inUseCount;
    }

    // Build the chart data according to the required JSON format.
    const chartData = [
      {
        id: "inuse",
        label: "In Use",
        showMark: false,
        curve: "linear",
        stack: "total",
        area: true,
        stackOrder: "ascending",
        data: inUseData,
      },
      {
        id: "reserved",
        label: "Reserved",
        showMark: false,
        curve: "linear",
        stack: "total",
        area: true,
        stackOrder: "ascending",
        data: reservedData,
      },
    ];

    return res.json(chartData);
  } catch (error) {
    console.error("Error generating car availability chart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getIncomeData = async (req, res) => {
  try {
    // Define the 7-month window: past 3 months, current month, next 3 months.
    const current = dayjs();
    const months = [];
    // Start 3 months ago (beginning of that month)
    const startMonth = current.subtract(3, "month").startOf("month");

    // Build an array of 7 dayjs objects, one for each month in the window
    for (let i = 0; i < 7; i++) {
      months.push(startMonth.add(i, "month"));
    }

    // Initialize an array for the income data for each month
    const incomeData = Array(7).fill(0);

    // Determine the overall date range
    const startRange = months[0].startOf("month").toDate();
    const endRange = months[6].endOf("month").toDate();

    // Query all bills and populate the request field to get endDate and requestStatus.
    const bills = await BillModel.find().populate({
      path: "request",
      select: "endDate requestStatus"
    });

    // Process each bill to sum income by month based on the Request's endDate.
    bills.forEach(bill => {
      // Ensure the bill has an associated Request with endDate and requestStatus.
      if (bill.request && bill.request.endDate && bill.request.requestStatus) {
        const billEndDate = dayjs(bill.request.endDate);

        // Only include bills whose Request endDate is within the 7-month window.
        if (
          billEndDate.isBefore(dayjs(startRange)) ||
          billEndDate.isAfter(dayjs(endRange))
        ) {
          return; // skip bills outside our window
        }

        // Find the corresponding index in the months array.
        const index = months.findIndex(month => {
          return (
            billEndDate.year() === month.year() &&
            billEndDate.month() === month.month()
          );
        });

        if (index >= 0) {
          // Depending on requestStatus, add depositFee or totalCarFee.
          const requestStatus = bill.request.requestStatus;
          if (["2", "3", "4"].includes(requestStatus)) {
            incomeData[index] += bill.depositFee || 0;
          } else if (requestStatus === "5") {
            incomeData[index] += bill.totalCarFee || 0;
          }
        }
      }
    });

    // Build the response with the computed income data.
    const responseData = [{
      id: "completed",
      label: "Completed Payments",
      data: incomeData,
      stack: "A"
    }];

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error computing income data:", error);
    return res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getUserTrend,
  getRequestTrend,
  getCarAvailability,
  getIncomeData
};
