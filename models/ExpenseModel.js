const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['capital', 'material', 'operational', 'other'],
      default: 'material',
    },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    rawMaterial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RawMaterial',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
