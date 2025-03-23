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
      interval: "Last 30 days",
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
      interval: "Last 30 days",
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
    // Get today's date and reset the time to midnight for consistency.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next30Days = 30;

    // Fetch only accepted requests (status "3") that may affect the next 30 days.
    const requests = await RequestModel.find({
      requestStatus: "3",
      endDate: { $gte: today },
    }).lean();

    // Initialize arrays for each day of the next 30 days.
    const reservedData = Array(next30Days).fill(0);
    const inUseData = Array(next30Days).fill(0);

    // Loop over each day in the next 30 days.
    for (let i = 0; i < next30Days; i++) {
      // Calculate the current day by adding i days to today.
      const currentDay = new Date(today);
      currentDay.setDate(currentDay.getDate() + i);

      // For each accepted request, check where the current day falls relative to its rental period.
      requests.forEach((request) => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        // Number of cars booked in this request.
        const numCars = Array.isArray(request.car) ? request.car.length : 0;

        if (currentDay < startDate) {
          // The rental has not started yet: count it as reserved.
          reservedData[i] += numCars;
        } else if (currentDay >= startDate && currentDay < endDate) {
          // The rental is currently in use.
          inUseData[i] += numCars;
        }
      });
    }
    // Create the output data in the format required for a stacked line graph.
    // Here, "inuse" will be the lower (bottom) layer and "reserved" will be the upper layer.
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
    console.error("Error generating rental chart data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getIncomeData = async (req, res) => {
  try {
    // Define the 7-month window:
    // - Past 3 months, current month, next 3 months.
    const current = dayjs();
    const months = [];
    // Start 3 months ago (beginning of that month)
    const startMonth = current.subtract(3, "month").startOf("month");

    // Build an array of 7 dayjs objects for each month in the window
    for (let i = 0; i < 7; i++) {
      months.push(startMonth.add(i, "month"));
    }

    // Initialize two arrays (one for each series) with 7 zeros
    const completedData = Array(7).fill(0);
    const pendingData = Array(7).fill(0);

    // Determine the overall date range
    const startRange = months[0].startOf("month").toDate();
    const endRange = months[6].endOf("month").toDate();

    // Query all bills and populate the requestId field to get its endDate.
    const bills = await BillModel.find().populate({
      path: "requestId",
      select: "endDate"
    });

    // Process each bill to sum totals by month based on the Request's endDate.
    bills.forEach(bill => {
      // Ensure the bill has an associated Request with an endDate.
      if (bill.requestId && bill.requestId.endDate) {
        const billEndDate = dayjs(bill.requestId.endDate);

        // Only include bills whose Request endDate is in the 7-month window.
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
          // Add the bill total to the correct series based on billStatus.
          if (bill.billStatus === true) {
            completedData[index] += bill.total;
          } else {
            pendingData[index] += bill.total;
          }
        }
      }
    });

    // Build the response in the required format.
    // "stack: 'A'" indicates that the two series should stack.
    const responseData = [
      {
        id: "completed",
        label: "Completed Payments",
        data: completedData,
        stack: "A"
      },
      {
        id: "pending",
        label: "Pending Payments",
        data: pendingData,
        stack: "A"
      }
    ];

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
