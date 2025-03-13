require('dotenv').config();
const BillModel = require("../models/bill.model");
const RequestModel = require("../models/bill.model")


const getAllBill = async (req, res) => {
    try {
        const bills = await BillModel.find().populate({
            path: "requestId",
            select: "-requestStatus -driver -car -isRequestDriver",
        });
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving bills: " + error.message });
    }
};


const toggleBillStatus = async (req, res) => {
    try {
        const { billId } = req.params;
        console.log(billId)

        // Find the bill by ID
        const bill = await BillModel.findById(billId);
        if (!bill) {
            return res.status(404).json({ error: "Bill not found" });
        }

        // Toggle the billStatus value
        bill.billStatus = !bill.billStatus;
        await bill.save();

        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ error: "Error toggling bill status: " + error.message });
    }
};


module.exports = { getAllBill, toggleBillStatus };