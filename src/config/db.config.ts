import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { DB_NAME } from "../common/constants.common.js";

async function connectDB(): Promise<void> {
  try {
    logger.notice(`trying connecting to mongoDB...`);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI || ""}/${DB_NAME}`
    );
    logger.notice(
      `MongoDB connected host: ${connectionInstance.connection.host} port: ${connectionInstance.connection.port}`
    );
  } catch (err) {
    logger.error(`MongoDB connection faild: ${err}`);
    process.exit(1);
  }
}

export default connectDB;
