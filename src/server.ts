import * as http from "http";
import app from "./app.js";
import { rootdir } from "./common/constants.common.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import { addMongoTransport, logger } from "./utils/logger.js";
import mongoose from "mongoose";
import env from "./config/env.config.js";

loadEnvironment();
await connectDB();

if (env.NODE_ENV === "production") {
  addMongoTransport(logger, mongoose.connection.getClient());
}

const server: http.Server = http.createServer(app);
const port = env.PORT;
const host = env.HOST;

server.listen(port, () => {
  logger.notice(
    `server started env:${process.env.NODE_ENV} host:${host} port: ${port}`
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown(): void {
  logger.notice("Received shutdown signal");
  server.close(() => {
    mongoose.connection.close();
    logger.notice("server closed successfully");
    process.exit(0);
  });

  setTimeout(() => {
    logger.notice("Forcefully closing server");
    process.exit(1);
  }, 10000);
}

function loadEnvironment(): void {
  switch (process.env.NODE_ENV) {
    case "development":
      dotenv.config({
        path: `${rootdir}/.env.development`,
      });
      logger.notice("development environment loaded");
      break;
    case "production":
      dotenv.config({
        path: `${rootdir}/.env.production`,
      });
      logger.notice("production environment loaded");
      break;
    case "testing":
      dotenv.config({
        path: `${rootdir}/.env.test`,
      });
      logger.notice("test environment loaded");
      break;
    default:
      dotenv.config();
  }
}
