const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      unique: true,
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentProof: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Waiting Payment",
        "Payment Verification",
        "Confirmed",
        "Rejected",
      ],
      default: "Waiting Payment",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
