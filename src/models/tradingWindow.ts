import mongoose from "mongoose";
import { WindowDocument } from "../types/tradingWindowTypes.js";
import { windowStatus, windowTypes } from "../common/constants.js";

const windowSchema = new mongoose.Schema<WindowDocument>({
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
  settlementStartTime: {
    type: Date,
    required: true,
  },
  settlementEndTime: {
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

const WindowModel = mongoose.model("tradingWindow", windowSchema);

export default WindowModel;
