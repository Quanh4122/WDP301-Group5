const UserModel = require("../models/user.model");
const RequestModel = require("../models/request.model");

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
        const dateMap = new Map(users.map(u => [u._id, u.count]));

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
            title: "User signup",
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
                    timeCreated: { $gte: startDate, $lte: today }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timeCreated" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Create a map for quick lookup of counts per day
        const dateMap = new Map(results.map(doc => [doc._id, doc.count]));

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
            title: "Request recieved",
            value: valueStr,
            interval: "Last 30 days",
            trend,
            data: dailyCounts
        });
    } catch (error) {
        console.error("Error fetching request trend:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserTrend,
    getRequestTrend
};
