require("dotenv").config();
const DriverModel = require("../models/driver.model");
const RequestModel = require("../models/request.model");

// Create a new driver
const createDriver = async (req, res) => {
  try {
    const { name, age, image } = req.body;

    // Check if all required fields are provided
    if (!name || !age || !image) {
      return res
        .status(400)
        .json({ message: "Name, age, and image are required" });
    }

    // Check if a driver with the same name already exists
    const existingDriver = await DriverModel.findOne({ name });
    if (existingDriver) {
      return res
        .status(400)
        .json({ message: "A driver with this name already exists" });
    }

    // Create a new driver
    const newDriver = new DriverModel({ name, age, image });

    // Save to the database
    await newDriver.save();

    res
      .status(201)
      .json({ message: "Driver created successfully", driver: newDriver });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get driver by ID
const getDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Check if driverId is valid
    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required" });
    }

    // Find the driver by ID
    const driver = await DriverModel.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    // Fetch all drivers from the database
    const drivers = await DriverModel.find();

    // Check if there are no drivers
    if (!drivers.length) {
      return res.status(404).json({ message: "No drivers found" });
    }

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllFreeDrivers = async (req, res) => {
  try {
    // Fetch all drivers from the database
    const drivers = await DriverModel.find();
    const request = await RequestModel.find();
    const listDriverInRequest = request
      .map((item) => item.driver)
      .flat()
      .reduce((acc, current) => {
        if (!acc.includes(current)) {
          acc.push(current);
        }
        return acc;
      }, []);
    // Check if there are no drivers
    if (!drivers.length) {
      return res.status(404).json({ message: "No drivers found" });
    } else {
      const driverRel = drivers.map((item) => {
        if (listDriverInRequest.filter((dt) => dt == item._id).length == 0) {
          return item;
        }
      });
      res.status(200).json(driverRel);
    }
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createDriver, getDriver, getAllDrivers, getAllFreeDrivers };
