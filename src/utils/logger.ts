import winston from "winston";
import { MongoDBConnectionOptions, MongoDB } from "winston-mongodb";
import mongoose from "mongoose";
import { collections } from "../common/constants.common.js";

declare module "winston" {
  interface Logger {
    critic: winston.LeveledLogMethod;
    notice: winston.LeveledLogMethod;
  }
}

const customLevels = {
  levels: {
    critic: 0,
    error: 1,
    notice: 2,
    info: 3,
    debug: 4,
    verbose: 5,
  },
  colors: {
    critic: "redBG",
    error: "red",
    notice: "cyan",
    info: "green",
    debug: "gray",
    verbose: "yellowBG",
  },
};

const logLevel =
  process.env.LOG_LEVEL || process.env.NODE_ENV === "production"
    ? "notice"
    : "verbose";

const logger = winston.createLogger({
  levels: customLevels.levels,
});

addConsoleTransport(logger);

function addConsoleTransport(logger: winston.Logger) {
  logger.add(
    new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.prettyPrint(),
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level} ${message}`;
        })
      ),
    })
  );
}

function addMongoTransport(
  logger: winston.Logger,
  mongoClient: mongoose.mongo.MongoClient
) {
  const transportOptions: MongoDBConnectionOptions = {
    db: Promise.resolve(mongoClient),
    collection: collections.LOG_ERRORS,
    level: "error",
  };

  const mongoTransport = new MongoDB(transportOptions);

  mongoTransport.on("error", (error) => {
    logger.error(`MongoDB Transport error: ${error}`);
  });

  logger.add(mongoTransport);
}

export { logger, logLevel, addMongoTransport };
