const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true, default: "kg" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    minimumStock: { type: Number, min: 0, default: 0 },
    unitCost: { type: Number, required: true, min: 0, default: 0 },
    supplier: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.RawMaterial ||
  mongoose.model("RawMaterial", rawMaterialSchema);
