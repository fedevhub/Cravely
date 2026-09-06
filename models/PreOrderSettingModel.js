const mongoose = require('mongoose');

const preOrderSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: 'current',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.PreOrderSetting || mongoose.model('PreOrderSetting', preOrderSettingSchema);
