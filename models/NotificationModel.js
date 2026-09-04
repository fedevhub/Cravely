const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["order", "message", "system"], default: "system" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "/" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);