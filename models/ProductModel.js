const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["sweet", "savory"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      required: true,
      enum: ["ready stok", "pre order"],
    },
    stock: { type: Number, min: 0, default: 0 },
    stockCapacity: { type: Number, min: 0, default: 20 },
    minimumStock: { type: Number, min: 0, default: 5 },

    detail: {
      gallery: [{ type: String }],
      fullDescription: { type: String },
      ingredients: [{ type: String }],
      weight: { type: String },
      servings: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
