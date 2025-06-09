import * as http from "http";
import app from "./app.js";
import { rootdir } from "./common/constants.common.js";
import dotenv from "dotenv";

loadEnvironment();

throw new Error("test error");

const server: http.Server = http.createServer(app);
const port = process.env.port || 3001;
const host = process.env.host || "localhost";

server.listen(port, () => {
  console.log(`server started env:${process.env} host:${host} port: ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown(): void {
  console.log("Received shutdown signal");
  server.close(() => {
    console.log("server closed successfully");
    process.exit(0);
  });

  setTimeout(() => {
    console.log("Forcefully closing server");
    process.exit(1);
  }, 10000);
}

function loadEnvironment(): void {
  switch (process.env.NODE_ENV) {
    case "development":
      dotenv.config({
        path: `${rootdir}/.env.devlopment`,
      });
      break;
    case "production":
      dotenv.config({
        path: `${rootdir}/.env.production`,
      });
      break;
    case "test":
      dotenv.config({
        path: `${rootdir}/.env.test`,
      });
      break;
    default:
      dotenv.config();
  }
}
