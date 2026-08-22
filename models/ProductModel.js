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

    detail: {
      gallery: [{ type: String }],
      fullDescription: { type: String },
      ingredients: [{ type: String }],
      weight: { type: String },
      servings: { type: String },
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
