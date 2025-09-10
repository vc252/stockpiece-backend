import mongoose, { Document } from "mongoose";
import { windowSchema } from "../schemas/TradingWindow.js";
import { z } from "zod";

type Window = z.infer<typeof windowSchema>;

interface WindowDocument extends Window, Document<mongoose.Types.ObjectId> {}

export { Window, WindowDocument };
