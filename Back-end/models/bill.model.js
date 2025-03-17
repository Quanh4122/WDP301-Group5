const mongoose = require("mongoose");

// Define Bill schema
const BillSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true, // note: use "required" instead of "require"
  },
  billStatus: {
    type: Boolean,
    default: false,
    required: true,
  },
  total: {
    type: Number,
    // no static default here; we'll compute it in a pre-save hook
  }
});

// Pre-save hook to compute total from the related Request document
BillSchema.pre("save", async function (next) {
  // Only compute if this is a new document and total is not provided
  if (this.isNew && (this.total === undefined || this.total === null)) {
    try {
      // Find the related Request and populate its car field
      const request = await mongoose.model("Request").findById(this.requestId).populate("car");

      if (request && request.car) {
        let totalPrice = 0;

        // If request.car is an array, sum the prices; otherwise, use the price directly.
        if (Array.isArray(request.car)) {
          totalPrice = request.car.reduce((sum, car) => sum + car.price, 0);
        } else {
          totalPrice = request.car.price;
        }

        // Set the computed total
        this.total = totalPrice;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Create and export the Bill model
const BillModel = mongoose.model("Bill", BillSchema);
module.exports = BillModel;
