import mongoose from "mongoose";
import { TradingWindowDocument } from "../types/tradingWindowTypes.js";
import { windowStatus, windowTypes } from "../common/constants.js";

const tradingWindowSchema = new mongoose.Schema<TradingWindowDocument>({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  tradingStartTime: {
    type: Date,
    required: true,
  },
  tradingEndTime: {
    type: Date,
    required: true,
  },
  context: {
    type: {
      type: String,
      required: true,
      enum: Object.values(windowTypes),
    },
    number: Number,
  },
  status: {
    type: String,
    enum: Object.values(windowStatus),
    required: true,
  },
  totalBuyVolume: {
    type: Number,
  },
  totalSellVolume: {
    type: Number,
  },
  totalMarketVolume: {
    type: Number,
  },
  totalUsers: {
    type: Number,
  },
  totalHolders: {
    type: Number,
  },
  totalParticipants: {
    type: Number,
  },
});

const TradinWindowModel = mongoose.model("tradingWindow", tradingWindowSchema);

export default TradinWindowModel;
