const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: {
      type: String,
      enum: ['admin', 'customer'],
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['order', 'payment', 'review', 'system'],
      default: 'system',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '/dashboard/notifications' },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
