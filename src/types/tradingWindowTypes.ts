import mongoose, { Document } from "mongoose";
import { tradingWindowSchema } from "../schemas/TradingWindow.js";
import { z } from "zod";

type TradingWindow = z.infer<typeof tradingWindowSchema>;

interface TradingWindowDocument
  extends TradingWindow,
    Document<mongoose.Types.ObjectId> {}

export { TradingWindow, TradingWindowDocument };
