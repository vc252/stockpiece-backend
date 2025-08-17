import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      unique: true,
    },
    currentPrice: {
      type: Number,
      required: true,
      default: 50,
    },
    imageURL: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "this is a stock",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StockModel = mongoose.model("Stock", stockSchema);

export default StockModel;
