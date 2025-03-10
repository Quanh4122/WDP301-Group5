const UserModel = require("../models/user.model");

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

module.exports = {
    getUserTrend
};
