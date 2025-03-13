require('dotenv').config();
const DriverModel = require('../models/driver.model');

const createDriver = async (req, res) => {
    try {
        const { name, image, driverLicenseVerifyNumber, DoB, licenseStatus, driverStatus, licenseType } = req.body;

        if (!name || !image || !driverLicenseVerifyNumber || !DoB || licenseStatus === undefined || driverStatus === undefined || !licenseType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDriver = await DriverModel.findOne({ driverLicenseVerifyNumber });
        if (existingDriver) {
            return res.status(400).json({ message: "A driver with this license number already exists" });
        }

        const newDriver = new DriverModel({ name, image, driverLicenseVerifyNumber, DoB, licenseStatus, driverStatus, licenseType });
        await newDriver.save();

        res.status(201).json({ message: "Driver created successfully", driver: newDriver });
    } catch (error) {
        console.error("Error creating driver:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getDriver = async (req, res) => {
    try {
        const { driverId } = req.params;
        if (!driverId) return res.status(400).json({ message: "Driver ID is required" });

        const driver = await DriverModel.findById(driverId);
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json(driver);
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await DriverModel.find();
        if (!drivers.length) return res.status(404).json({ message: "No drivers found" });

        res.status(200).json(drivers);
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedDriver = await DriverModel.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
        if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ message: "Driver updated successfully", driver: updatedDriver });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDriver = await DriverModel.findByIdAndDelete(id);
        if (!deletedDriver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createDriver, getDriver, getAllDrivers, updateDriver, deleteDriver };
